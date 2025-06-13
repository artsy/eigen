package net.artsy.app.widgets.client

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import net.artsy.app.widgets.models.Article
import net.artsy.app.widgets.models.Artist
import net.artsy.app.widgets.models.Artwork
import net.artsy.app.widgets.models.ArtworkImage
import org.json.JSONArray
import org.json.JSONObject
import org.xml.sax.Attributes
import org.xml.sax.helpers.DefaultHandler
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.*
import javax.xml.parsers.SAXParserFactory

class ArtsyApiClient {
    
    companion object {
        private const val ARTWORKS_BASE_URL = "https://artsy-public.s3.amazonaws.com/artworks-of-the-day"
        private const val RSS_URL = "https://www.artsy.net/rss/news"
        private const val GEMINI_PROXY = "https://d7hftxdivxxvm.cloudfront.net/"
        
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
                listOf(Artwork.fallback())
            }
        }
    }
    
    suspend fun fetchLatestArticles(): List<Article> {
        return withContext(Dispatchers.IO) {
            try {
                val rssData = downloadBytes(RSS_URL)
                if (rssData != null) {
                    parseRssFeed(rssData)
                } else {
                    generateFallbackArticles()
                }
            } catch (e: Exception) {
                generateFallbackArticles()
            }
        }
    }
    
    suspend fun downloadArtworkImage(artwork: Artwork, widgetWidth: Int, widgetHeight: Int): Bitmap? {
        return withContext(Dispatchers.IO) {
            try {
                val imageUrl = buildImageUrl(artwork.firstImageToken, widgetWidth, widgetHeight)
                downloadImage(imageUrl)
            } catch (e: Exception) {
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
            return listOf(Artwork.fallback())
        }
    }
    
    private fun parseRssFeed(rssData: ByteArray): List<Article> {
        try {
            val articles = mutableListOf<Article>()
            
            val factory = SAXParserFactory.newInstance()
            val saxParser = factory.newSAXParser()
            
            val handler = object : DefaultHandler() {
                private var currentElement = ""
                private var currentTitle = ""
                private var currentLink = ""
                private var currentPubDate = ""
                private var insideItem = false
                
                override fun startElement(uri: String?, localName: String?, qName: String?, attributes: Attributes?) {
                    currentElement = qName ?: ""
                    if (currentElement == "item") {
                        insideItem = true
                        currentTitle = ""
                        currentLink = ""
                        currentPubDate = ""
                    }
                }
                
                override fun characters(ch: CharArray?, start: Int, length: Int) {
                    if (insideItem) {
                        val content = String(ch ?: charArrayOf(), start, length).trim()
                        when (currentElement) {
                            "title" -> currentTitle += content
                            "link" -> currentLink += content
                            "pubDate" -> currentPubDate += content
                        }
                    }
                }
                
                override fun endElement(uri: String?, localName: String?, qName: String?) {
                    if (qName == "item") {
                        if (currentTitle.isNotEmpty() && currentLink.isNotEmpty()) {
                            articles.add(
                                Article(
                                    title = currentTitle,
                                    link = currentLink,
                                    pubDate = currentPubDate
                                )
                            )
                        }
                        insideItem = false
                        
                        // Stop after collecting 4 articles
                        if (articles.size >= 4) {
                            return
                        }
                    }
                }
            }
            
            saxParser.parse(rssData.inputStream(), handler)
            return articles.take(4).ifEmpty { generateFallbackArticles() }
        } catch (e: Exception) {
            return generateFallbackArticles()
        }
    }
    
    private fun generateFallbackArticles(): List<Article> {
        return listOf(
            Article(
                title = "Latest Art News and Trends",
                link = "https://www.artsy.net/article/artsy-editorial-latest-art-news",
                pubDate = "Mon, 10 Jun 2024 12:00:00 GMT"
            ),
            Article(
                title = "Emerging Artists to Watch",
                link = "https://www.artsy.net/article/artsy-editorial-emerging-artists",
                pubDate = "Sun, 9 Jun 2024 10:00:00 GMT"
            ),
            Article(
                title = "Art Market Insights",
                link = "https://www.artsy.net/article/artsy-editorial-art-market-insights",
                pubDate = "Sat, 8 Jun 2024 15:00:00 GMT"
            ),
            Article(
                title = "Gallery Spotlight",
                link = "https://www.artsy.net/article/artsy-editorial-gallery-spotlight",
                pubDate = "Fri, 7 Jun 2024 11:00:00 GMT"
            )
        )
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
    
    private fun downloadString(urlString: String): String? {
        return try {
            val url = URL(urlString)
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 10000
            connection.readTimeout = 10000
            
            if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                connection.inputStream.bufferedReader().use { it.readText() }
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }
    
    private fun downloadBytes(urlString: String): ByteArray? {
        return try {
            val url = URL(urlString)
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 10000
            connection.readTimeout = 10000
            
            if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                connection.inputStream.readBytes()
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }
    
    private fun downloadImage(imageUrl: String): Bitmap? {
        return try {
            val url = URL(imageUrl)
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 10000
            connection.readTimeout = 10000
            connection.doInput = true
            
            if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                val inputStream: InputStream = connection.inputStream
                BitmapFactory.decodeStream(inputStream)
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }
}