import Foundation

typealias ParserHandler = ([Article]) -> Void

class ArticleParser: NSObject, XMLParserDelegate {
    static func parse(data: Data, handler: @escaping ParserHandler) {
        let parser = XMLParser(data: data)
        let articleParser = ArticleParser(handler: handler)
        parser.delegate = articleParser
        parser.parse()
    }
    
    var articles = [Article]()
    let handler: ParserHandler
    
    private var currentElement = ""
    private var article = Article()
    
    init(handler: @escaping ParserHandler) {
        self.handler = handler
    }
    
    func parser(_ parser: XMLParser, didStartElement elementName: String, namespaceURI: String?, qualifiedName qName: String?, attributes attributeDict: [String : String] = [:]) {
        currentElement = elementName
        
        if currentElement == "item" {
            article.resetProperties()
        } else if currentElement == "enclosure" {
            let imageUrl = attributeDict["url"]!
            article.updateProperty(elementName: "imageUrl", value: imageUrl)
        }
    }
    
    func parser(_ parser: XMLParser, foundCharacters string: String) {
        let tagContent = string.trimmingCharacters(in: .whitespacesAndNewlines)
        article.updateProperty(elementName: currentElement, value: tagContent)
    }
    
    func parser(_ parser: XMLParser, didEndElement elementName: String, namespaceURI: String?, qualifiedName qName: String?) {
        if elementName == "item" {
            let finalized = article.finalize()
            articles.append(finalized)
            
            if articles.count == 4 {
                handler(articles)
            }
        }
    }
}
