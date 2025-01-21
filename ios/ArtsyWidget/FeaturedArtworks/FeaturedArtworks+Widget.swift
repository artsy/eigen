import Foundation
import SwiftUI
import WidgetKit

extension FeaturedArtworks {
    struct Widget: SwiftUI.Widget {
        static let description: String = "A curated selection of newly uploaded works from galleries, fairs, and auctions."
        static let displayName: String = "New This Week"
        static let kind: String = "FeaturedArtworksWidget"
        
        var body: some WidgetConfiguration {
            StaticConfiguration(kind: Widget.kind, provider: Provider()) { entry in
                View(entry: entry)
            }
            .configurationDisplayName(Widget.displayName)
            .description(Widget.description)
            .supportedFamilies(View.supportedFamilies)
        }
    }
}
