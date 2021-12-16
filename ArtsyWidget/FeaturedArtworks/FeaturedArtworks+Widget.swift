import Foundation
import SwiftUI
import WidgetKit

extension FeaturedArtworks {
    struct Widget: SwiftUI.Widget {
        static let kind: String = "FeaturedArtworksWidget"
        
        var body: some WidgetConfiguration {
            StaticConfiguration(kind: Widget.kind, provider: Provider()) { entry in
                View(entry: entry)
            }
            .configurationDisplayName("Trove")
            .description("The best works on Artsy this week.")
            .supportedFamilies(View.supportedFamilies)
        }
    }
}
