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
            let articleUrl = article.url!
            
            GeometryReader { geo in
                ZStack() {
                    Image(uiImage: articleImage)
                        .resizable()
                        .scaledToFill()
                        .frame(width: geo.size.width, height: geo.size.height, alignment: .top)
                    VStack() {
                        Spacer()
                        HStack(alignment: .top) {
                            VStack() {
                                PrimaryText(name: articleTitle, color: .white)
                                    .lineLimit(2)
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
