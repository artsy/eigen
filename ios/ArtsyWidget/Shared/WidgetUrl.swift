import Foundation

struct WidgetUrl {
    static let trackingUTM = "?utm_medium=ios_widget"
    
    static func from(link: String) -> URL? {
        let fullPath = [link, trackingUTM].joined()
        return URL(string: fullPath)
    }
}
