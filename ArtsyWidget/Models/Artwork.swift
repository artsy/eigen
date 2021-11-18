import Foundation
import UIKit

struct Artwork {
    static func fallback() -> Artwork {
        let artist = Artist(name: "Chloe Wise")
        let image = UIImage(named: "PrimaryArtworkImage")!
        let artwork = Artwork(
            artist: artist,
            image: image,
            slug: "chloe-wise-never-stop-thinking-about-that-nude-spa-in-berlin-brooke-at-sundown",
            title: "Never stop thinking about that nude spa in Berlin (Brooke at sundown)"
        )
        
        return artwork
    }
    
    let artist: Artist
    let image: UIImage
    let slug: String
    let title: String
}
