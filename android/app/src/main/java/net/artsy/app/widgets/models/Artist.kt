package net.artsy.app.widgets.models

data class Artist(
    val id: String,
    val name: String
) {
    companion object {
        fun fallback(): Artist {
            return Artist(
                id = "fallback-artist-id",
                name = "Unknown Artist"
            )
        }
    }
}