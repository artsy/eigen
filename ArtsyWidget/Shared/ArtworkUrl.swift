import Foundation

struct ArtworkUrl {
    static func from(slug: String) -> URL {
        let artworkUrl = URL(string: "https://www.artsy.net/artwork/\(slug)?utm_medium=ios_widget")!
        return artworkUrl
    }
}
