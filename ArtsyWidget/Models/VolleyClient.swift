import Foundation
import WidgetKit

struct VolleyClient {
    static let endpoint = URL(string: "https://volley.artsy.net/report")!
    
    static func reportGetTimeline(kind: String, family: WidgetFamily) {
        let kindTag = "widget_kind:\(kind)"
        let typeTag = "widget_type:\(family)"
        
        let metric = VolleyMetric(type: "increment", name: "get_timeline", tags: [kindTag, typeTag])
        // how can i make this conditionally include "staging"?
        let serviceName = "ios_widget"
        let payload = VolleyPayload(serviceName: serviceName, metrics: [metric])
        
        let client = VolleyClient(payload: payload)
        client.report()
    }
    
    let encoder: JSONEncoder
    let payload: VolleyPayload
    let urlSession: URLSession
    
    func configureRequest() -> URLRequest {
        var request = URLRequest(url: VolleyClient.endpoint)
        
        let body = try? encoder.encode(payload)
        request.httpBody = body
        
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        return request
    }
    
    init(payload: VolleyPayload) {
        self.payload = payload
        
        self.encoder = JSONEncoder()
        self.urlSession = URLSession.shared
    }
    
    func report() {
        let request = configureRequest()
        let task = urlSession.dataTask(with: request, completionHandler: handleReportResponse)
        task.resume()
    }
    
    func handleReportResponse(data: Data?, response: URLResponse?, error: Error?) {
        // i don't know what to do here other than print
        print("handleReportResponse")
    }
}
