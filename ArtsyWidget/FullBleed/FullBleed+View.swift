import Foundation
import SwiftUI
import WidgetKit

extension FullBleed {
    struct View: SwiftUI.View {
        static var supportedFamilies: [WidgetFamily] {
            if #available(iOSApplicationExtension 15.0, *) {
                return [.systemLarge, .systemExtraLarge]
            } else {
                return [.systemLarge]
            }
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
                    .widgetURL(artworkUrl)
                }
            }
        }
    }
    
    
}

struct FullBleed_View_Previews: PreviewProvider {
    static var previews: some SwiftUI.View {
        let entry = FullBleed.Entry.fallback()
        let families = FullBleed.View.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                FullBleed.View(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
