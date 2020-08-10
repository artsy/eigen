import Foundation

@objc class ContinuationArtwork: NSObject {
    let title: String
    let slug: String
    let internalID: String
    let artworkID: String
    let artistName: String
    let medium: String
//    let isAcquireable: Bool?
//    let isOfferable: Bool?
//    let isBiddable: Bool?
//    let isInquirable: Bool?
//    let availability: Bool?

    @objc required init?(withDictionary dictionary: Dictionary<String, Any>) {
        guard
            let title = dictionary["title"] as? String,
            let artistName = dictionary["artistName"] as? String,
            let medium = dictionary["medium"] as? String,
            let slug = dictionary["slug"] as? String,
            let internalID = dictionary["internalID"] as? String,
            let artworkID = dictionary["id"] as? String
        else {
            return nil
        }

        self.title = title
        self.artistName = artistName
        self.medium = medium
        self.slug = slug
        self.internalID = internalID
        self.artworkID = artworkID
    }
}

extension ContinuationArtwork: ARSpotlightMetadataProvider {
    func spotlightThumbnailURL() -> URL! {
        // TODO: return self.urlForThumbnail
        return URL(string: "https://d32dm0rphc51dk.cloudfront.net/TuBz6l-bKTT5F3Ec9k6Ikw/large.jpg")!
    }

    func spotlightDescription() -> String! {
        // TODO: Account for date
        return "\(self.artistName)\n\(self.medium)"
    }


    // MARK: ShareableObject

    func name() -> String! {
        return self.title
    }

    func publicArtsyPath() -> String! {
        return "/artwork/\(self.artworkID)"
    }

    func publicArtsyID() -> String! {
        return self.artworkID
    }
}
