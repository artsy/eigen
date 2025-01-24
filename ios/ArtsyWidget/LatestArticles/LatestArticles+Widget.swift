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
                if #available(iOSApplicationExtension 17.0, *) {
                    View(entry: entry).containerBackground(Color.white, for: .widget)
                } else {
                    View(entry: entry).background(Color.white)
                }
            }
            .configurationDisplayName(Widget.displayName)
            .containerBackgroundRemovable(false)
            .contentMarginsDisabled()
            .description(Widget.description)
            .supportedFamilies(View.supportedFamilies)
        }
    }
}
