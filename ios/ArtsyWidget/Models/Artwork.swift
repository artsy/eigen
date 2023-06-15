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
    
    var firstImageToken: String {
        let defaultImage = artworkImages.first(where: { $0.isDefault })
        let sortedImages = artworkImages.sorted { $0.position < $1.position }
        let firstImage = defaultImage ?? sortedImages.first ?? ArtworkImage.fallback()
        
        return firstImage.geminiToken
    }
    
    var url: URL {
        let link = ["https://www.artsy.net/artwork/", id].joined()
        return WidgetUrl.from(link: link)!
    }
    
    enum CodingKeys: String, CodingKey {
        case artworkImages = "images"
        
        case artist
        case id
        case title
    }
}
