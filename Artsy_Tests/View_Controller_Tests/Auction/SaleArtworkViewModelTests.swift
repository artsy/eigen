import Quick
import Nimble
import Mantle
@testable
import Artsy

class SaleArtworkViewModelTests: QuickSpec {
    override func spec() {
        var subject: SaleArtworkViewModel!

        beforeEach {
            let artistJSON: NSDictionary = [
                "id": "artist_id",
                "name": "Artist name"
            ]
            let imagesJSON: NSArray = [
                [
                    "id": "image_1_id",
                    "is_default": true,
                    "image_url": "http://example.com/:version.jpg",
                    "image_versions": ["large"]
                ]
            ]
            let artworkJSON: NSDictionary = [
                "id": "artwork_id",
                "artist": artistJSON,
                "title": "roly poly",
                "images": imagesJSON,
            ]
            let saleArtwork = SaleArtwork(json:
                [
                    "id": "sale",
                    "artwork": artworkJSON,
                    "lot_label": "13",
                    "bidder_positions_count": 4,
                    "highest_bid": ["id": "bid-id", "amount_cents": 1_000_00],
                    "symbol": "$"
                ]
            )

            subject = SaleArtworkViewModel(saleArtwork: saleArtwork!)
        }

        it("returns thumnail url") {
            expect(subject.thumbnailURL?.absoluteString) == "http://example.com/large.jpg"
        }

        it("returns artist name") {
            expect(subject.artistName) == "Artist name"
        }

        it("returns artwork name") {
            expect(subject.artworkName) == "roly poly"
        }

        it("returns lot number") {
            expect(subject.lotLabel) == "13"
        }

        it("returns number of bids") {
            expect(subject.numberOfBids) == "(4 Bids)"
        }

        it("returns starting bid combined") {
            expect(subject.currentOrStartingBidWithNumberOfBids(false)) == "$1,000"
        }

        it("returns starting bid alone") {
            expect(subject.currentOrStartingBidWithNumberOfBids(true)) == "$1,000 (4 Bids)"
        }

        it("returns artwork ID") {
            expect(subject.artworkID) == "artwork_id"
        }
    }
}
