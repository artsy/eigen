import Foundation
import WidgetKit

extension FullBleed {
    struct Entry: TimelineEntry {
        let artwork: Artwork
        let date: Date
        
        static func fallback() -> Entry {
            let artwork = Fixtures.primaryArtwork
            let date = Date()
            let entry = Entry(artwork: artwork, date: date)
            
            return entry
        }
    }
}
