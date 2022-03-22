import Foundation
import SwiftUI
import WidgetKit

extension LatestArticles {
    struct Widget: SwiftUI.Widget {
        static let kind: String = "LatestArticlesWidget"
        
        var body: some WidgetConfiguration {
            StaticConfiguration(kind: Widget.kind, provider: Provider()) { entry in
                View(entry: entry)
            }
            .configurationDisplayName("Editorial")
            .description("The latest articles from Artsy Editorial.")
            .supportedFamilies(View.supportedFamilies)
        }
    }
}
