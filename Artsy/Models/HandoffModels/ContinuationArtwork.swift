import Foundation

@objc class ContinuationArtwork: NSObject, ARSpotlightMetadataProvider {
    func spotlightThumbnailURL() -> URL! {
        return URL(string: "https://d32dm0rphc51dk.cloudfront.net/TuBz6l-bKTT5F3Ec9k6Ikw/large.jpg")!
    }

    func spotlightDescription() -> String! {
        return "here is my spotlight description"
    }

    func name() -> String! {
        return "Spotlight name"
    }

    func publicArtsyPath() -> String! {
        return "/artwork/laurie-hogin-dutch-masters-lord-motorola"
    }

    func publicArtsyID() -> String! {
        return "laurie-hogin-dutch-masters-lord-motorola"
    }
}
