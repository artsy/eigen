import Foundation
import WidgetKit

extension FeaturedArtworks {
    struct Entry: TimelineEntry {
        let artworks: [Artwork]
        let date: Date
        
        static func fallback() -> Entry {
            let artworks = [
                Fixtures.primaryArtwork,
                Fixtures.secondaryArtwork,
                Fixtures.tertiaryArtwork,
                Fixtures.quaternaryArtwork
            ]
            let date = Date()
            let entry = Entry(artworks: artworks, date: date)
            
            return entry
        }
    }
}
