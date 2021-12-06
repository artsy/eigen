import SwiftUI
import WidgetKit

extension LatestArticles {
    struct SmallView: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemSmall]
        
        let entry: Entry
        
        var article: Article {
            return entry.articles.first!
        }
        
        var body: some SwiftUI.View {
            let artsyLogo = UIImage(named: "WhiteArtsyLogo")!
            let articleImage = article.image!
            let articleTitle = article.title
            let publishedAt = article.pubDate
            let articleUrl = article.url!
            
            GeometryReader { geo in
                ZStack() {
                    Image(uiImage: articleImage)
                        .resizable()
                        .scaledToFill()
                        .frame(width: geo.size.width, height: geo.size.height, alignment: .top)
                    VStack() {
                        HStack() {
                            Image(uiImage: artsyLogo)
                                .resizable()
                                .frame(width: 20, height: 20)
                                .padding([.leading, .top], 10)
                            Spacer()
                        }
                        Spacer()
                        VStack() {
                            PrimaryText(name: articleTitle, color: .white)
                                .lineLimit(2)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            SecondaryText(title: publishedAt, color: .white)
                                .lineLimit(1)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                        .padding([.leading, .trailing, .bottom], 10)
                    }
                    .widgetURL(articleUrl)
                }
            }
        }
    }
}

struct LatestArticles_SmallView_Previews: PreviewProvider {
    static var previews: some View {
        let entry = LatestArticles.Entry.fallback()
        let families = LatestArticles.SmallView.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                LatestArticles.SmallView(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
