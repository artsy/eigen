package net.artsy.app.widgets.models

data class Artist(
    val id: String,
    val name: String
) {
    companion object {
        fun fallback(): Artist {
            return Artist(
                id = "alex-katz",
                name = "Alex Katz"
            )
        }
    }
}