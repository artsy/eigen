import Foundation

@objc class HandoffFair: NSObject {
    let slug: String

    @objc required init?(withDictionary dictionary: Dictionary<String, Any>) {
        guard
            let slug = dictionary["slug"] as? String
        else {
            return nil
        }
        self.slug = slug
    }
}

extension HandoffFair {

    // MARK: ShareableObject
    func publicArtsyPath() -> String! {
        return "/\(self.slug)"
    }

    func publicArtsyID() -> String! {
        return self.slug
    }
}

