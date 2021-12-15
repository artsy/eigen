import XCTest

class ArtworkTests: XCTestCase {
    // it returns a cleaned up URL from the first image
    func testFirstImageUrlWithArtworkImage() throws {
        let artworkImage = ArtworkImage(imageUrl: "https://www.artsy.net/images/abc123/:version.png")
        let artist = Artist(name: "Sally Something")
        let artwork = Artwork(artist: artist, artworkImages: [artworkImage], id: "abc123", title: "Super Sculpture")
        
        let expected = URL(string: "https://www.artsy.net/images/abc123/larger.png")!
        
        XCTAssertEqual(artwork.firstImageUrl, expected)
    }
    
    // it returns a cleaned up URL from the fallback image
    func testFallsBackWithoutArtworkImage() throws {
        let artist = Artist(name: "Sally Something")
        let artwork = Artwork(artist: artist, artworkImages: [], id: "abc123", title: "Super Sculpture")
        
        let expectedUrl = ArtworkImage.fallback().imageUrl.replacingOccurrences(of: ":version", with: "larger")
        let expected = URL(string: expectedUrl)!
        
        XCTAssertEqual(artwork.firstImageUrl, expected)
    }
}
