import Foundation
import SwiftUI
import WidgetKit

extension LatestArticles {
    struct Widget: SwiftUI.Widget {
        static let description: String = "The latest articles from Artsy Editorial."
        static let displayName: String = "Editorial"
        static let kind: String = "LatestArticlesWidget"
        
        var body: some WidgetConfiguration {
            StaticConfiguration(kind: Widget.kind, provider: Provider()) { entry in
                View(entry: entry)
            }
            .configurationDisplayName(Widget.displayName)
            .contentMarginsDisabled()
            .description(Widget.description)
            .supportedFamilies(View.supportedFamilies)
        }
    }
}
