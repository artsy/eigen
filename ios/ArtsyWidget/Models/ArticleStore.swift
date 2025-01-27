import Foundation
import SwiftUI
import Combine

typealias ArticleStoreCompletionHandler = ([Article]) -> Void

class ArticleStore {
    static func fetch(completion: @escaping ArticleStoreCompletionHandler) {
        let store = ArticleStore()
        store.fetch(completion: completion)
    }
    
    var articles: [Article]?
    var cancellable: AnyCancellable?
    var completion: ArticleStoreCompletionHandler?
    var parser: XMLParser?
    
    let urlSession: URLSession
    
    init() {
        self.urlSession = URLSession.shared
    }
    
    func fetch(completion: @escaping ArticleStoreCompletionHandler) {
        self.completion = completion
        
        let rssUrl = "https://www.artsy.net/rss/news"
        
        guard
            let rssEndpoint = URL(string: rssUrl)
        else { return }
        
        let rssTask = urlSession.dataTask(with: URLRequest(url: rssEndpoint), completionHandler: handleRssTask)
        rssTask.resume()
    }
    
    func handleRssTask(data: Data?, response: URLResponse?, error: Error?) {
        guard let data = data else { return }
        
        let parser = XMLParser(data: data)
        self.parser = parser
        let articleParser = ArticleParser(handler: handleParsedFeed)
        parser.delegate = articleParser
        parser.parse()
    }
    
    func handleParsedFeed(articles: [Article]) {
        self.articles = articles
        
        guard
            let completion = completion
        else { return }
        
        completion(articles)
    }
}
