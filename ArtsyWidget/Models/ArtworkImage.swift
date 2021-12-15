import Foundation

struct ArtworkImage: Codable {
    static func fallback() -> ArtworkImage {
        let artwork = Fixtures.primaryArtwork
        let imageUrl = artwork.artworkImages.first!.imageUrl
        let artworkImage = ArtworkImage(imageUrl: imageUrl)
        return artworkImage
    }
    
    let imageUrl: String
}
