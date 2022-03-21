import Foundation
import WidgetKit

extension LatestArticles {
    struct Entry: TimelineEntry {
        let articles: [Article]
        let date: Date
        
        static func fallback() -> Entry {
            let articles = [
                Fixtures.primaryArticle,
                Fixtures.secondaryArticle,
                Fixtures.tertiaryArticle,
                Fixtures.quaternaryArticle
            ]
            let date = Date()
            let entry = Entry(articles: articles, date: date)
            
            return entry
        }
    }
}
