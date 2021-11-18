import Foundation
import UIKit

struct Artwork: Codable {
    static func fallback() -> Artwork {
        let artist = Artist(name: "Chloe Wise")
        let artworkImage = ArtworkImage(imageUrl: "")
        let image = UIImage(named: "PrimaryArtworkImage")!
        let artwork = Artwork(
            artist: artist,
            artworkImages: [artworkImage],
            id: "chloe-wise-never-stop-thinking-about-that-nude-spa-in-berlin-brooke-at-sundown",
            title: "Never stop thinking about that nude spa in Berlin (Brooke at sundown)",
            image: image
        )
        
        return artwork
    }
    
    let artist: Artist
    let artworkImages: [ArtworkImage]
    let id: String
    let title: String
    
    var image: UIImage?
    
    var firstImageUrl: URL {
        let firstImage = artworkImages.first ?? ArtworkImage.fallback()
        let imageUrl = firstImage.imageUrl.replacingOccurrences(of: ":version", with: "square")
        let url = URL(string: imageUrl)!
        
        return url
    }
    
    enum CodingKeys: String, CodingKey {
        case artworkImages = "images"
        
        case artist
        case id
        case title
    }
}
