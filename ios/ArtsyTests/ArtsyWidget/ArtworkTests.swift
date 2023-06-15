import XCTest

class ArtworkTests: XCTestCase {
    // it returns a cleaned up URL from the first image
    func testDefaultImageUrlWithArtworkImage() throws {
        let firstImage = ArtworkImage(geminiToken: "abc123", isDefault: false, position: 1)
        let defaultImage = ArtworkImage(geminiToken: "abc123", isDefault: true, position: 2)
        
        let artist = Artist(name: "Sally Something")
        let artwork = Artwork(artist: artist, artworkImages: [firstImage, defaultImage], id: "abc123", title: "Super Sculpture")

        XCTAssertEqual(artwork.firstImageToken, defaultImage.geminiToken)
    }
    
    // it returns a cleaned up URL from the first image
    func testFirstImageUrlWithArtworkImage() throws {
        let firstImage = ArtworkImage(geminiToken: "abc123", isDefault: false, position: 1)
        
        let artist = Artist(name: "Sally Something")
        let artwork = Artwork(artist: artist, artworkImages: [firstImage], id: "abc123", title: "Super Sculpture")

        XCTAssertEqual(artwork.firstImageToken, firstImage.geminiToken)
    }

    // it returns a cleaned up URL from the fallback image
    func testFallsBackWithoutArtworkImage() throws {
        let artist = Artist(name: "Sally Something")
        let artwork = Artwork(artist: artist, artworkImages: [], id: "abc123", title: "Super Sculpture")

        XCTAssertEqual(artwork.firstImageToken, ArtworkImage.fallback().geminiToken)
    }
}
