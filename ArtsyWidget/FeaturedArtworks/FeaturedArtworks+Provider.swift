import Foundation
import WidgetKit

extension FeaturedArtworks {
    struct Provider: TimelineProvider {
        func placeholder(in context: Context) -> Entry {
            Entry.fallback()
        }
        
        func getSnapshot(in context: Context, completion: @escaping (Entry) -> ()) {
            let entry = Entry.fallback()
            completion(entry)
        }
        
        func getTimeline(in context: Context, completion: @escaping (WidgetKit.Timeline<Entry>) -> ()) {
            VolleyClient.reportGetTimeline(kind: FeaturedArtworks.Widget.kind, family: context.family)
            Timeline.generate(context: context, completion: completion)
        }
    }
}
