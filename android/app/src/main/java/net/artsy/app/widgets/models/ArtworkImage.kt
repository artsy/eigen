package net.artsy.app.widgets.models

data class ArtworkImage(
    val geminiToken: String,
    val isDefault: Boolean,
    val position: Int
) {
    companion object {
        fun fallback(): ArtworkImage {
            return ArtworkImage(
                geminiToken = "pd7rW3I1mXhW0vbAJDVm3Q",
                isDefault = true,
                position = 0
            )
        }
    }
}