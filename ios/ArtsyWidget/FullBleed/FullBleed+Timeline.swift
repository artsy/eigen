import WidgetKit

extension FullBleed {
    struct Timeline {
        static func generate(context: TimelineProviderContext, completion: @escaping (WidgetKit.Timeline<Entry>) -> ()) {
            ArtworkStore.fetch(context: context) { artworks in
                let schedule = Schedule()
                let updateTimesToArtworks = Array(zip(schedule.updateTimes, artworks))
                let entries = updateTimesToArtworks.map() { (date, artwork) in Entry(artwork: artwork, date: date) }
                let timeline = WidgetKit.Timeline(entries: entries, policy: .after(schedule.nextUpdate))
                completion(timeline)
            }
        }
    }
}
