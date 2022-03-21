import SwiftUI
import WidgetKit

private struct TopArtwork: SwiftUI.View {
    let artwork: Artwork
    
    var body: some SwiftUI.View {
        let artsyLogo = UIImage(named: "BlackArtsyLogo")!
        let artworkImage = artwork.image!
        let artistName = artwork.artist.name
        let artworkTitle = artwork.title
        let artworkUrl = artwork.url
        
        HStack(alignment: .bottom) {
            Image(uiImage: artworkImage)
                .resizable()
                .scaledToFit()
                .clipped()
            VStack(alignment: .trailing) {
                Image(uiImage: artsyLogo)
                    .resizable()
                    .frame(width: 20, height: 20)
                Spacer()
                PrimaryText(name: artistName)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
                SecondaryText(title: artworkTitle)
                    .lineLimit(4)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding(16)
        .background(Color.white)
        .widgetURL(artworkUrl)
    }
}

private struct BottomArtwork: SwiftUI.View {
    let artwork: Artwork
    
    var body: some SwiftUI.View {
        let artworkImage = artwork.image!
        let artistName = artwork.artist.name
        let artworkTitle = artwork.title
        let artworkUrl = artwork.url
        
        Link(destination: artworkUrl) {
            VStack() {
                Spacer()
                Image(uiImage: artworkImage)
                    .resizable()
                    .scaledToFit()
                VStack() {
                    PrimaryText(name: artistName)
                        .lineLimit(1)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    SecondaryText(title: artworkTitle)
                        .lineLimit(2)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Spacer(minLength: 0)
                }
                .frame(height: 45)
            }
        }
    }
}

extension FeaturedArtworks {
    struct LargeView: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemLarge]
        
        let entry: Entry
        
        var primaryArtwork: Artwork {
            return entry.artworks[0]
        }
        
        var secondaryArtwork: Artwork {
            return entry.artworks[1]
        }
        
        var tertiaryArtwork: Artwork {
            return entry.artworks[2]
        }
        
        var quaternaryArtwork: Artwork {
            return entry.artworks[3]
        }
        
        var body: some SwiftUI.View {
            let topFactor: Double = 1 / 2
            let bottomFactor = 1 - topFactor
            
            GeometryReader { geo in
                VStack(spacing: 0) {
                    TopArtwork(artwork: primaryArtwork)
                        .frame(height: geo.size.height * CGFloat(topFactor))
                    HStack(alignment: .bottom) {
                        BottomArtwork(artwork: secondaryArtwork)
                        BottomArtwork(artwork: tertiaryArtwork)
                        BottomArtwork(artwork: quaternaryArtwork)
                    }
                    .padding(16)
                    .background(Color(white: 0.96))
                    .frame(height: geo.size.height * CGFloat(bottomFactor))
                }
            }
        }
    }
}

struct FeaturedArtworks_LargeView_Previews: PreviewProvider {
    static var previews: some SwiftUI.View {
        let entry = FeaturedArtworks.Entry.fallback()
        let families = FeaturedArtworks.LargeView.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                FeaturedArtworks.LargeView(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
