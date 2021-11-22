import SwiftUI
import WidgetKit

private struct TopArtwork: SwiftUI.View {
    let artwork: Artwork
    
    var body: some SwiftUI.View {
        let artsyLogo = UIImage(named: "BlackArtsyLogo")!
        let artworkImage = artwork.image!
        let artistName = artwork.artist.name
        let artworkTitle = artwork.title
        let artworkUrl = ArtworkUrl.from(slug: artwork.id)
        
        HStack(alignment: .top) {
            Image(uiImage: artworkImage)
                .resizable()
                .scaledToFit()
            VStack() {
                PrimaryText(name: artistName)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
                SecondaryText(title: artworkTitle)
                    .lineLimit(3)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            Image(uiImage: artsyLogo)
                .resizable()
                .frame(width: 20, height: 20)
        }
        .padding(10)
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
        let artworkUrl = ArtworkUrl.from(slug: artwork.id)
        
        Link(destination: artworkUrl) {
            HStack(alignment: .top) {
                Image(uiImage: artworkImage)
                    .resizable()
                    .scaledToFit()
                VStack() {
                    PrimaryText(name: artistName)
                        .lineLimit(1)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    SecondaryText(title: artworkTitle)
                        .lineLimit(3)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
        }
    }
}

extension FeaturedArtworks {
    struct MediumView: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemMedium]
        
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
        
        var body: some SwiftUI.View {
            let topFactor: Double = 11 / 20
            let bottomFactor = 1 - topFactor
            
            GeometryReader { geo in
                VStack(spacing: 0) {
                    TopArtwork(artwork: primaryArtwork)
                        .frame(height: geo.size.height * topFactor)
                    HStack() {
                        BottomArtwork(artwork: secondaryArtwork)
                        BottomArtwork(artwork: tertiaryArtwork)
                    }
                    .padding(10)
                    .background(Color(white: 0.96))
                    .frame(height: geo.size.height * bottomFactor)
                }
            }
        }
    }
}

struct FeaturedArtworks_MediumView_Previews: PreviewProvider {
    static var previews: some SwiftUI.View {
        let entry = FeaturedArtworks.Entry.fallback()
        let families = FeaturedArtworks.MediumView.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                FeaturedArtworks.MediumView(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
