import Foundation
import UIKit

struct Artwork: Codable {
    static func fallback() -> Artwork {
        return Fixtures.primaryArtwork
    }
    
    let artist: Artist
    let artworkImages: [ArtworkImage]
    let id: String
    let title: String
    
    var image: UIImage?
    
    var firstImageUrl: URL {
        let firstImage = artworkImages.first ?? ArtworkImage.fallback()
        let imageUrl = firstImage.imageUrl.replacingOccurrences(of: ":version", with: "larger")
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
