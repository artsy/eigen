import SwiftUI
import WidgetKit

extension LatestArticles {
    struct LargeView: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemLarge]
        
        let entry: Entry
        
        var body: some SwiftUI.View {
            let artsyLogo = UIImage(named: "BlackArtsyLogo")!
            let articles = entry.articles
            
            VStack() {
                HStack(alignment: .center) {
                    Text("LATEST ARTICLES")
                        .foregroundColor(.black)
                        .font(.system(size: 14, weight: .medium))
                    Spacer()
                    Image(uiImage: artsyLogo)
                        .resizable()
                        .frame(width: 20, height: 20)
                }
                Spacer()
                VStack() {
                    ForEach(articles, id: \.url) { article in
                        Link(destination: article.url!) {
                            HStack(alignment: .center) {
                                Image(uiImage: article.image!)
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: 64, height: 64, alignment: .top)
                                    .clipped()
                                VStack() {
                                    PrimaryText(name: article.title)
                                        .lineLimit(3)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    SecondaryText(title: article.pubDate)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                }
                            }
                        }
                    }
                }
            }
            .padding(16)
            .background(Color.white)
        }
    }
}

struct LatestArticles_LargeView_Previews: PreviewProvider {
    static var previews: some View {
        let entry = LatestArticles.Entry.fallback()
        let families = LatestArticles.LargeView.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                LatestArticles.LargeView(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
