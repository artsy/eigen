import SwiftUI
import WidgetKit

extension LatestArticles {
    struct View: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemSmall, .systemMedium, .systemLarge]
        
        @Environment(\.widgetFamily) var family: WidgetFamily
        
        let entry: Entry
        
        var article: Article {
            return entry.articles.first!
        }
        
        var body: some SwiftUI.View {
            switch family {
            case .systemMedium:
                LatestArticles.MediumView(entry: entry)
            case .systemLarge:
                LatestArticles.LargeView(entry: entry)
            default:
                LatestArticles.SmallView(entry: entry)
            }
        }
    }
}

struct LatestArticlesWidgetView_Previews: PreviewProvider {
    static var previews: some View {
        let entry = LatestArticles.Entry.fallback()
        let families = LatestArticles.View.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                LatestArticles.View(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
