import WidgetKit

extension LatestArticles {
    struct Timeline {
        static func generate(completion: @escaping (WidgetKit.Timeline<Entry>) -> ()) {
            ArticleStore.fetch() { articles in
                let schedule = Schedule()
                let entry = Entry(articles: articles, date: Date())
                let timeline = WidgetKit.Timeline(entries: [entry], policy: .after(schedule.nextUpdate))
                completion(timeline)
            }
        }
    }
}
