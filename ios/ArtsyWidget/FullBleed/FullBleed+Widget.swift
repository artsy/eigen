import Foundation
import SwiftUI
import WidgetKit

extension FullBleed {
    struct Widget: SwiftUI.Widget {
        static let kind: String = "FullBleedWidget"
        
        var body: some WidgetConfiguration {
            StaticConfiguration(kind: Widget.kind, provider: Provider()) { entry in
                View(entry: entry)
            }
            .configurationDisplayName("New This Week")
            .description("A curated selection of newly uploaded works from galleries, fairs, and auctions.")
            .supportedFamilies(View.supportedFamilies)
        }
    }
}
