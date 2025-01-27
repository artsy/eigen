import SwiftUI
import WidgetKit

extension LatestArticles {
    struct MediumView: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemMedium]
        
        let entry: Entry
        
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
            let articles = entry.articles[0...1]
            let artsyUrl = WidgetUrl.from(link: "https://www.artsy.net")!
            
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
                .widgetURL(artsyUrl)
                Spacer()
                HStack(alignment: .top) {
                    ForEach(articles, id: \.url) { article in
                        Link(destination: article.url!) {
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
                    }
                }
            }
            .padding(16)
        }
    }
}

struct LatestArticles_MediumView_Previews: PreviewProvider {
    static var previews: some View {
        let entry = LatestArticles.Entry.fallback()
        let families = LatestArticles.MediumView.supportedFamilies
        
        Group {
            ForEach(families, id: \.self) { family in
                LatestArticles.MediumView(entry: entry)
                    .previewContext(WidgetPreviewContext(family: family))
            }
        }
    }
}
