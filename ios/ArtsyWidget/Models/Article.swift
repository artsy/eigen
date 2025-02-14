import Foundation
import UIKit

struct Article {
    static var parser: DateFormatter {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "E, d MMM yyyy HH:mm:ss zzz"
        return dateFormatter
    }
    
    static var printer: DateFormatter {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MMM d"
        return dateFormatter
    }
    
    var link: String
    var pubDate: String
    var title: String
    
    var url: URL?
    
    init() {
        self.link = ""
        self.pubDate = ""
        self.title = ""
    }
    
    init(pubDate: String, title: String, url: URL) {
        self.init()
        self.pubDate = pubDate
        self.title = title
        self.url = url
    }
    
    mutating func resetProperties() {
        self = Article()
    }
    
    mutating func updateProperty(elementName: String, value: String) {
        switch elementName {
        case "link":
            link += value
        case "pubDate":
            pubDate += value
        case "title":
            title += value
        default: break
        }
    }
    
    mutating func finalize() -> Article {
        finalizePubDate()
        finalizeUrl()
        
        return self
    }
    
    mutating func finalizePubDate() {
        guard let publishedAt = Article.parser.date(from: self.pubDate) else { return }
        
        let pubDate = Article.printer.string(from: publishedAt)
        self.pubDate = pubDate
    }
    
    mutating func finalizeUrl() {
        guard url == nil else { return }
        
        self.url = WidgetUrl.from(link: link)
    }
}
