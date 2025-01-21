import Foundation
import SwiftUI
import WidgetKit

extension FullBleed {
    struct Widget: SwiftUI.Widget {
        static let description: String = "A curated selection of newly uploaded works from galleries, fairs, and auctions."
        static let displayName: String = "New This Week"
        static let kind: String = "FullBleedWidget"
        
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
