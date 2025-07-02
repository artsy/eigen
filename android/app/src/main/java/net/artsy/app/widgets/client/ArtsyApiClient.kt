package net.artsy.app.widgets.client

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import net.artsy.app.widgets.models.Artist
import net.artsy.app.widgets.models.Artwork
import net.artsy.app.widgets.models.ArtworkImage
import org.json.JSONArray
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ArtsyApiClient {

    companion object {
        private const val ARTWORKS_BASE_URL = "https://artsy-public.s3.amazonaws.com/artworks-of-the-day"
        private const val GEMINI_PROXY = "https://d7hftxdivxxvm.cloudfront.net/"
        private const val TAG = "ArtsyApiClient"

        @Volatile
        private var INSTANCE: ArtsyApiClient? = null

        fun getInstance(): ArtsyApiClient {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: ArtsyApiClient().also { INSTANCE = it }
            }
        }
    }

    suspend fun fetchFeaturedArtworks(): List<Artwork> {
        return withContext(Dispatchers.IO) {
            try {
                val dateFormatter = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                val feedDate = dateFormatter.format(Date())
                val feedUrl = "$ARTWORKS_BASE_URL/$feedDate.json"

                val jsonString = downloadString(feedUrl)
                if (jsonString != null) {
                    parseArtworksJson(jsonString)
                } else {
                    listOf(Artwork.fallback())
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error fetching artworks: ${e.message ?: e.toString()}")
                listOf(Artwork.fallback())
            }
        }
    }


    suspend fun downloadArtworkImage(artwork: Artwork, widgetWidth: Int, widgetHeight: Int): Bitmap? {
        return withContext(Dispatchers.IO) {
            try {
                val imageUrl = buildImageUrl(artwork.firstImageToken, widgetWidth, widgetHeight)
                downloadImage(imageUrl)
            } catch (e: Exception) {
                Log.e(TAG, "Error downloading image: ${e.message ?: e.toString()}")
                null
            }
        }
    }

    private fun parseArtworksJson(jsonString: String): List<Artwork> {
        try {
            val jsonArray = JSONArray(jsonString)
            val artworks = mutableListOf<Artwork>()

            for (i in 0 until minOf(jsonArray.length(), 4)) {
                val artworkJson = jsonArray.getJSONObject(i)

                val artist = Artist(
                    id = artworkJson.getJSONObject("artist").getString("id"),
                    name = artworkJson.getJSONObject("artist").getString("name")
                )

                val imagesArray = artworkJson.getJSONArray("images")
                val artworkImages = mutableListOf<ArtworkImage>()

                for (j in 0 until imagesArray.length()) {
                    val imageJson = imagesArray.getJSONObject(j)
                    artworkImages.add(
                        ArtworkImage(
                            geminiToken = imageJson.getString("gemini_token"),
                            isDefault = imageJson.optBoolean("is_default", false),
                            position = imageJson.optInt("position", j)
                        )
                    )
                }

                val artwork = Artwork(
                    id = artworkJson.getString("id"),
                    title = artworkJson.getString("title"),
                    artist = artist,
                    artworkImages = artworkImages
                )

                artworks.add(artwork)
            }

            return artworks.ifEmpty { listOf(Artwork.fallback()) }
        } catch (e: Exception) {
                Log.e(TAG, "Error parsing the artworks json: ${e.message ?: e.toString()}")
            return listOf(Artwork.fallback())
        }
    }


    private fun buildImageUrl(token: String, width: Int, height: Int): String {
        val params = mapOf(
            "convert_to" to "webp",
            "height" to height.toString(),
            "quality" to "50",
            "resize_to" to "width",
            "token" to token,
            "width" to width.toString()
        )

        val query = params.map { "${it.key}=${it.value}" }.joinToString("&")
        return "$GEMINI_PROXY?$query"
    }

    private fun <T> download(urlString: String, processor: (InputStream) -> T): T? {
        return try {
            val url = URL(urlString)
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 10000
            connection.readTimeout = 10000

            if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                connection.inputStream.use(processor)
            } else {
                null
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error downloading from $urlString: ${e.message ?: e.toString()}")
            null
        }
    }

    private fun downloadString(urlString: String): String? {
        return download(urlString) { inputStream ->
            inputStream.bufferedReader().use { it.readText() }
        }
    }

    private fun downloadImage(imageUrl: String): Bitmap? {
        return download(imageUrl) { inputStream ->
            BitmapFactory.decodeStream(inputStream)
        }
    }
}