import WidgetKit
import SwiftUI

@main
struct ArtsyWidgets: WidgetBundle {
    var body: some Widget {
        FeaturedArtworks.Widget()
        FullBleed.Widget()
        LatestArticles.Widget()
    }
}
