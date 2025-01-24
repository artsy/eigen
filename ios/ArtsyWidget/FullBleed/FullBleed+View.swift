import Foundation
import SwiftUI
import WidgetKit

extension FullBleed {
    struct View: SwiftUI.View {
        static var supportedFamilies: [WidgetFamily] {
            return [.systemLarge, .systemExtraLarge]
        }
        
        let entry: Entry
        
        var artwork: Artwork {
            return entry.artwork
        }
        
        var body: some SwiftUI.View {
            let artsyLogo = UIImage(named: "WhiteArtsyLogo")!
            let artworkImage = artwork.image!
            let artistName = artwork.artist.name
            let artworkTitle = artwork.title
            let artworkUrl = artwork.url
            
            GeometryReader { geo in
                ZStack() {
                    Image(uiImage: artworkImage)
                        .resizable()
                        .scaledToFill()
                        .frame(width: geo.size.width, height: geo.size.height, alignment: .top)
                    VStack() {
                        Spacer()
                        HStack() {
                            VStack() {
                                PrimaryText(name: artistName, color: .white)
                                    .lineLimit(1)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                SecondaryText(title: artworkTitle, color: .white)
                                    .lineLimit(1)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                            Spacer()
                            Image(uiImage: artsyLogo)
                                .resizable()
                                .frame(width: 20, height: 20)
                        }
                        .padding(16)
                        .background(Color.black)
                    }
                }
            }
            .widgetURL(artworkUrl)
        }
    }
}

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemLarge, widget: {
    FullBleed.Widget()
}, timeline: {
    FullBleed.Entry.fallback()
})
