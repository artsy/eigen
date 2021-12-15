import Foundation
import SwiftUI
import WidgetKit

extension FeaturedArtworks {
    struct View: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemSmall, .systemMedium, .systemLarge]
        
        @Environment(\.widgetFamily) var family: WidgetFamily
        
        let entry: Entry
        
        var body: some SwiftUI.View {
            switch family {
            case .systemMedium:
                FeaturedArtworks.MediumView(entry: entry)
            case .systemLarge:
                FeaturedArtworks.LargeView(entry: entry)
            default:
                FeaturedArtworks.SmallView(entry: entry)
            }
        }
    }
}

struct FeaturedArtworks_View_Previews: PreviewProvider {
    static var previews: some SwiftUI.View {
        let entry = FeaturedArtworks.Entry.fallback()
        let families = FeaturedArtworks.View.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                FeaturedArtworks.View(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
