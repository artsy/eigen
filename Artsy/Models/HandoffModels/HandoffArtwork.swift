import Foundation

@objc class HandoffArtwork: NSObject {
    let title: String
    let slug: String
    let internalID: String
    let artworkID: String
    let artistName: String
    let medium: String
    let imageURL: String
    let date: String

    @objc required init?(withDictionary dictionary: Dictionary<String, Any>) {
        guard
            let title = dictionary["title"] as? String,
            let artistName = dictionary["artistName"] as? String,
            let medium = dictionary["medium"] as? String,
            let slug = dictionary["slug"] as? String,
            let internalID = dictionary["internalID"] as? String,
            let artworkID = dictionary["id"] as? String,
            let imageURL = dictionary["imageURL"] as? String,
            let date = dictionary["date"] as? String
        else {
            return nil
        }

        self.title = title
        self.artistName = artistName
        self.medium = medium
        self.slug = slug
        self.internalID = internalID
        self.artworkID = artworkID
        self.imageURL = imageURL
        self.date = date
    }

    @objc func addToSpotlight() {
        ARSpotlight.add(toSpotlightIndex: true, entity: self)
    }
}

extension HandoffArtwork: ARSpotlightMetadataProvider {
    func spotlightThumbnailURL() -> URL! {
        return URL(string: self.imageURL)!
    }

    func spotlightDescription() -> String! {
        if (!self.date.isEmpty) {
            return "\(self.artistName), \(self.date)\n\(self.medium)"
        } else {
            return "\(self.artistName)\n\(self.medium)"
        }
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
