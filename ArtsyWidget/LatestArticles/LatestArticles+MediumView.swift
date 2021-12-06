import SwiftUI
import WidgetKit

extension LatestArticles {
    struct MediumView: SwiftUI.View {
        static let supportedFamilies: [WidgetFamily] = [.systemMedium]
        
        let entry: Entry
        
        var body: some SwiftUI.View {
            let artsyLogo = UIImage(named: "BlackArtsyLogo")!
            let articles = entry.articles[0...1]
            
            VStack() {
                HStack(alignment: .top) {
                    Text("ARTSY EDITORIAL")
                        .font(.system(size: 10, weight: .bold))
                    Spacer()
                    Image(uiImage: artsyLogo)
                        .resizable()
                        .frame(width: 20, height: 20)
                }
                Spacer()
                VStack() {
                    ForEach(articles, id: \.url) { article in
                        Link(destination: article.url!) {
                            HStack(alignment: .top) {
                                Image(uiImage: article.image!)
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: 48, height: 48, alignment: .top)
                                    .clipped()
                                VStack() {
                                    PrimaryText(name: article.title)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    SecondaryText(title: article.pubDate)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                }
                            }
                        }
                    }
                }
            }
            .padding(10)
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
