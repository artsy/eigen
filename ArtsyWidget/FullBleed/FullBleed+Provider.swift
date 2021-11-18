import Foundation
import WidgetKit

extension FullBleed {
    struct Provider: TimelineProvider {
        func placeholder(in context: Context) -> Entry {
            Entry.fallback()
        }
        
        func getSnapshot(in context: Context, completion: @escaping (Entry) -> ()) {
            let entry = Entry.fallback()
            completion(entry)
        }
        
        func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
            ArtworkStore.fetch() { artworks in
                let schedule = Schedule()
                let updateTimesToArtworks = Array(zip(schedule.updateTimes, artworks))
                let entries = updateTimesToArtworks.map() { (date, artwork) in Entry(artwork: artwork, date: date) }
                let timeline = Timeline(entries: entries, policy: .after(schedule.nextUpdate))
                completion(timeline)
            }
        }
    }
}
