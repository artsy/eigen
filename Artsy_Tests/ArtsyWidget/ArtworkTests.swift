import XCTest

class ArtworkTests: XCTestCase {
    // it returns a cleaned up URL from the first image
    func testFirstImageUrlWithArtworkImage() throws {
        let artworkImage = ArtworkImage(geminiToken: "abc123")
        let artist = Artist(name: "Sally Something")
        let artwork = Artwork(artist: artist, artworkImages: [artworkImage], id: "abc123", title: "Super Sculpture")
                
        XCTAssertEqual(artwork.firstImageToken, artworkImage.geminiToken)
    }
    
    // it returns a cleaned up URL from the fallback image
    func testFallsBackWithoutArtworkImage() throws {
        let artist = Artist(name: "Sally Something")
        let artwork = Artwork(artist: artist, artworkImages: [], id: "abc123", title: "Super Sculpture")
                
        XCTAssertEqual(artwork.firstImageToken, ArtworkImage.fallback().geminiToken)
    }
}
