import Foundation

@objc class HandoffFair: NSObject {
    let slug: String
    let fairID: String
    let href: String
    let fairName: String
    let imageURL: String
    let exhibitionPeriod: String
    let city: String?

    @objc required init?(withDictionary dictionary: Dictionary<String, Any>) {
        guard
            let fairID = dictionary["fairID"] as? String,
            let slug = dictionary["slug"] as? String,
            let name = dictionary["name"] as? String,
            let href = dictionary["href"] as? String,
            let imageURL = dictionary["imageURL"] as? String,
            let exhibitionPeriod = dictionary["exhibitionPeriod"] as? String
        else {
            return nil
        }
        self.href = href
        self.slug = slug
        self.fairID = fairID
        self.fairName = name
        self.imageURL = imageURL
        self.exhibitionPeriod = exhibitionPeriod
        self.city = dictionary["city"] as? String
    }
}

extension HandoffFair: ARSpotlightMetadataProvider {
    func spotlightThumbnailURL() -> URL! {
        let squareImageURLString = imageURL.replacingOccurrences(of: ":version", with: "square")
        return URL(string: squareImageURLString)!
    }

    func spotlightDescription() -> String! {
        if let city = self.city {
            return exhibitionPeriod + " • " + city
        } else {
            return exhibitionPeriod
        }
    }

    func name() -> String! {
        return fairName
    }
}

extension HandoffFair {

    // MARK: ShareableObject
    func publicArtsyPath() -> String! {
        return href
    }

    func publicArtsyID() -> String! {
        return fairID
    }
}

