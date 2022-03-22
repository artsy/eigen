import Foundation

struct ArtworkImage: Codable {
    static func fallback() -> ArtworkImage {
        let artwork = Fixtures.primaryArtwork
        let token = artwork.artworkImages.first!.geminiToken
        let artworkImage = ArtworkImage(geminiToken: token)
        return artworkImage
    }
    
    let geminiToken: String
}
