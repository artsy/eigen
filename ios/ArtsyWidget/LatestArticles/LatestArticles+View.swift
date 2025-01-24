import SwiftUI
import WidgetKit

extension LatestArticles {
    struct View: SwiftUI.View {
        static var supportedFamilies: [WidgetFamily] {
            return [.systemSmall, .systemMedium]
        }
        
        @Environment(\.widgetFamily) var family: WidgetFamily
        
        let entry: Entry
        
        var article: Article {
            return entry.articles.first!
        }
        
        var body: some SwiftUI.View {
            switch family {
            case .systemMedium:
                LatestArticles.MediumView(entry: entry)
            default:
                LatestArticles.SmallView(entry: entry)
            }
        }
    }
}

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemSmall, widget: {
    LatestArticles.Widget()
}, timeline: {
    LatestArticles.Entry.fallback()
})

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemMedium, widget: {
    LatestArticles.Widget()
}, timeline: {
    LatestArticles.Entry.fallback()
})
