import Foundation

struct VolleyPayload: Codable {
    let serviceName: String
    let metrics: [VolleyMetric]
}
