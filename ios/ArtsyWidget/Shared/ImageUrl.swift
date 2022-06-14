import Foundation
import SwiftUI
import WidgetKit

struct ImageUrl {
    static func build(token: String, context: TimelineProviderContext) -> URL {
        let geminiProxy = "https://d7hftxdivxxvm.cloudfront.net/"
                
        let scale = UIScreen.main.scale
        let size = context.displaySize
        
        let width = "\(size.width * scale)"
        let height = "\(size.height * scale)"
        
        let params: [String: String] = [
          "convert_to": "webp",
          "height": height,
          "quality": "50",
          "resize_to": "width",
          "token": token,
          "width": width,
        ]
        
        let query = params.map() { (key, value) in [key, value].joined(separator: "=") }.joined(separator: "&")
                    
        let url = [geminiProxy, query].joined(separator: "?")
        
        return URL(string: url)!
    }
}
