import Foundation

@objc class HandoffArtist: NSObject {
    let artistName: String
    let internalID: String
    let slug: String
    let birthday: String
    let blurb: String?
    let imageURL: String

    @objc required init?(withDictionary dictionary: Dictionary<String, Any>) {
        guard
            let name = dictionary["name"] as? String,
            let internalID = dictionary["internalID"] as? String,
            let slug = dictionary["slug"] as? String,
            let birthday = dictionary["birthday"] as? String,
            let imageURL = dictionary["imageURL"] as? String
        else {
            return nil
        }

        self.blurb = dictionary["blurb"] as? String
        self.artistName = name
        self.internalID = internalID
        self.slug = slug
        self.birthday = birthday
        self.imageURL = imageURL
    }

    @objc func addToSpotlight() {
        ARSpotlight.add(toSpotlightIndex: true, entity: self)
    }
}

extension HandoffArtist: ARSpotlightMetadataProvider {

    func name() -> String! {
        return self.artistName
    }

    func spotlightThumbnailURL() -> URL! {
        return URL(string: self.imageURL)!
    }

    func spotlightDescription() -> String! {
        if let blurb = self.blurb {
            return blurb
        } else {
            return self.birthday
        }
    }

    func spotlightMarkdownDescription() -> String? {
        return self.blurb
    }

    // MARK: ShareableObject

    func publicArtsyPath() -> String! {
        return "/artist/\(self.slug)"
    }

    func publicArtsyID() -> String! {
        return self.slug
    }
}
