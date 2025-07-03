package net.artsy.app.widgets.models

import android.graphics.Bitmap

data class Artwork(
    val id: String,
    val title: String,
    val artist: Artist,
    val artworkImages: List<ArtworkImage>,
    var image: Bitmap? = null
) {
    val firstImageToken: String
        get() {
            val defaultImage = artworkImages.find { it.isDefault }
            val sortedImages = artworkImages.sortedBy { it.position }
            val firstImage = defaultImage ?: sortedImages.firstOrNull() ?: ArtworkImage.fallback()
            return firstImage.geminiToken
        }

    val url: String
        get() = "https://www.artsy.net/artwork/$id?utm_medium=android_widget"

    companion object {
        fun fallback(): Artwork {
            return Artwork(
                id ="alex-katz-brisk-day-34",
                title = "Brisk Day",
                artist = Artist.fallback(),
                artworkImages = listOf(ArtworkImage.fallback())
            )
        }
    }
}