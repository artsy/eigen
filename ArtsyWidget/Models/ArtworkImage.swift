import Foundation

struct ArtworkImage: Codable {
    static func fallback() -> ArtworkImage {
        let fallbackUrl = "https://d32dm0rphc51dk.cloudfront.net/02XpcHIJyIsmdFj5u_2nOw/:version.jpg"
        return ArtworkImage(imageUrl: fallbackUrl)
    }
    
    let imageUrl: String
}
