package net.artsy.app.widgets.models

import java.text.SimpleDateFormat
import java.util.*

data class Article(
    val title: String,
    val link: String,
    val pubDate: String
) {
    val url: String get() = link

    val formattedPubDate: String
        get() {
            return try {
                val parser = SimpleDateFormat("E, d MMM yyyy HH:mm:ss zzz", Locale.ENGLISH)
                val printer = SimpleDateFormat("MMM d", Locale.ENGLISH)
                val date = parser.parse(pubDate)
                date?.let { printer.format(it) } ?: pubDate
            } catch (e: Exception) {
                pubDate
            }
        }

    companion object {
        fun fallback(): Article {
            return Article(
                title = "Fallback Article Title",
                link = "https://www.artsy.net",
                pubDate = "Mon, 1 Jan 2024 00:00:00 GMT"
            )
        }
    }
}