import Foundation
import SwiftUI
import WidgetKit

extension FullBleed {
    struct View: SwiftUI.View {
        static var supportedFamilies: [WidgetFamily] {
            return [.systemSmall, .systemLarge]
        }
        
        let entry: Entry
        
        var artwork: Artwork {
            return entry.artwork
        }
        
        var body: some SwiftUI.View {
            let artsyLogo = UIImage(named: "WhiteArtsyLogo")!
            let artworkImage = artwork.image!
            let artworkUrl = artwork.url
            
            GeometryReader { geo in
                ZStack() {
                    Image(uiImage: artworkImage)
                        .resizable()
                        .scaledToFill()
                        .scaleEffect(1.3)
                        .frame(width: geo.size.width, height: geo.size.height, alignment: .top)
                    VStack() {
                        HStack() {
                            Spacer()
                            Image(uiImage: artsyLogo)
                                .resizable()
                                .frame(width: 20, height: 20)
                        }
                        .padding(16)
                        Spacer()
                    }
                }
            }
            .widgetURL(artworkUrl)
        }
    }
}

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemSmall, widget: {
    FullBleed.Widget()
}, timeline: {
    FullBleed.Entry.fallback()
})

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemLarge, widget: {
    FullBleed.Widget()
}, timeline: {
    FullBleed.Entry.fallback()
})
