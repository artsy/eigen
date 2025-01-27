import SwiftUI
import WidgetKit

extension LatestArticles {
    struct View: SwiftUI.View {
        static var supportedFamilies: [WidgetFamily] {
            return [.systemSmall, .systemMedium]
        }
        
        @Environment(\.widgetFamily) var family: WidgetFamily
        
        let entry: Entry
        
        var article: Article {
            return entry.articles.first!
        }
        
        var articles: [Article] {
            return [
                entry.articles[0],
                entry.articles[1]
            ]
        }
        
        var body: some SwiftUI.View {
            let artsyLogo = UIImage(named: "WhiteArtsyLogo")!
            let artsyUrl = WidgetUrl.from(link: "https://www.artsy.net")!
            
            let titleFont = Font.system(size: 14, weight: .regular)
            let bodyFont = Font.system(size: 12, weight: .regular)
            let whiteColor = Color.white
            
            
            VStack() {
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
                if (family == .systemSmall) {
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
                    .widgetURL(article.url)
                } else {
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
            }
            .padding(16)
        }
    }
}

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemSmall, widget: {
    LatestArticles.Widget()
}, timeline: {
    LatestArticles.Entry.fallback()
})

@available(iOSApplicationExtension 17.0, *)
#Preview(as: .systemMedium, widget: {
    LatestArticles.Widget()
}, timeline: {
    LatestArticles.Entry.fallback()
})
