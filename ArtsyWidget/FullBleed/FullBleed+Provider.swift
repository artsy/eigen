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
            let entry = Entry.fallback()
            let entries = [entry]
            let timeline = Timeline(entries: entries, policy: .atEnd)
            completion(timeline)
        }
    }
}
