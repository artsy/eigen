import Foundation

struct ArtworkImage: Codable {
    static func fallback() -> ArtworkImage {
        let artwork = Fixtures.primaryArtwork
        let token = artwork.artworkImages.first!.geminiToken
        let artworkImage = ArtworkImage(geminiToken: token, position: 1)
        return artworkImage
    }
    
    let geminiToken: String
    let position: Int
}
