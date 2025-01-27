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
            if #available(iOSApplicationExtension 17.0, *) {
                actualBody().containerBackground(for: .widget) {
                    Color.black
                }
            } else {
                actualBody()
            }
        }
        
        func actualBody() -> some SwiftUI.View {
            let artsyLogo = UIImage(named: "WhiteArtsyLogo")!
            let titleFont = Font.system(size: 14, weight: .regular)
            let bodyFont = Font.system(size: 12, weight: .regular)
            let whiteColor = Color.white
            
            return VStack() {
                HStack(alignment: .top) {
                    Text("News")
                        .font(bodyFont)
                        .foregroundColor(whiteColor)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Spacer()
                    Image(uiImage: artsyLogo)
                        .resizable()
                        .frame(width: 20, height: 20)
                }
                Spacer()
                VStack() {
                    Text(article.title)
                        .font(titleFont)
                        .foregroundColor(whiteColor)
                        .lineLimit(4)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Spacer()
                    Text("Read More")
                        .font(titleFont)
                        .underline()
                        .foregroundColor(whiteColor)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .padding(16)
            .widgetURL(article.url)
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
