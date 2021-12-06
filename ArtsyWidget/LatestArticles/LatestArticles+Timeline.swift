import WidgetKit

extension LatestArticles {
    struct Timeline {
        static func rotateArticles(articles: [Article]) -> [[Article]] {
            let initialLineup = articles
            
            let nextLineups: [[Article]] = [0, 1, 2, 3].map() { offset in
                let trailing = Array(initialLineup.suffix(4 - offset))
                let leading = Array(initialLineup.prefix(offset))
                
                return trailing + leading
            }
            
            return nextLineups
        }
        
        static func generate(completion: @escaping (WidgetKit.Timeline<Entry>) -> ()) {
            ArticleStore.fetch() { articles in
                let schedule = Schedule()
                let rotatedArticles = Timeline.rotateArticles(articles: articles)
                let updateTimesToArticles = Array(zip(schedule.updateTimes, rotatedArticles))
                let entries = updateTimesToArticles.map() { (date, articles) in Entry(articles: articles, date: date) }
                let timeline = WidgetKit.Timeline(entries: entries, policy: .after(schedule.nextUpdate))
                completion(timeline)
            }
        }
    }
}
