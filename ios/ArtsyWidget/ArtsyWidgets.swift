import WidgetKit
import SwiftUI

@main
struct ArtsyWidgets: WidgetBundle {
    var body: some Widget {
        FullBleed.Widget()
        LatestArticles.Widget()
    }
}
