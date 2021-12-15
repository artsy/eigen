import SwiftUI
import WidgetKit

extension FeaturedArtworks {
    struct SmallView: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemSmall]
        
        let entry: Entry
        
        var artwork: Artwork {
            return entry.artworks.first!
        }
        
        var body: some SwiftUI.View {
            let artsyLogo = UIImage(named: "BlackArtsyLogo")!
            let artworkImage = artwork.image!
            let artistName = artwork.artist.name
            let artworkUrl = artwork.url
            
            VStack() {
                HStack(alignment: .top) {
                    Image(uiImage: artworkImage)
                        .resizable()
                        .scaledToFit()
                    Spacer()
                    Image(uiImage: artsyLogo)
                        .resizable()
                        .frame(width: 20, height: 20)
                }
                Spacer()
                PrimaryText(name: artistName)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(16)
            .widgetURL(artworkUrl)
            .background(Color.white)
        }
    }
}

struct FeaturedArtworks_SmallView_Previews: PreviewProvider {
    static var previews: some SwiftUI.View {
        let entry = FeaturedArtworks.Entry.fallback()
        let families = FeaturedArtworks.SmallView.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                FeaturedArtworks.SmallView(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
