import Quick
import Nimble
import Mantle
@testable
import Artsy

class SaleArtworkViewModelTests: QuickSpec {
    override func spec() {

        var artistJSON: NSDictionary!
        var imagesJSON: NSArray!
        var artworkJSON: NSDictionary!
        var saleArtwork: SaleArtwork!
        var subject: SaleArtworkViewModel!

        beforeEach {
            artistJSON = [
                "id": "artist_id",
                "name": "Artist name"
            ]
            imagesJSON = [
                [
                    "id": "image_1_id",
                    "is_default": true,
                    "image_url": "http://example.com/:version.jpg",
                    "image_versions": ["large"]
                ]
            ]
            artworkJSON = [
                "id": "artwork_id",
                "artist": artistJSON,
                "title": "roly poly",
                "images": imagesJSON,
            ]
            saleArtwork = SaleArtwork(json:
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

        it("assumes the sale is closed if not present on the sale artwork model") {
            expect(subject.isAuctionOpen) == false
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

        describe("a closed sale") {
            beforeEach {
                saleArtwork.auction = Sale(json: ["auction_state": "closed"])
            }

            it("returns isAuctionOpen as false") {
                expect(subject.isAuctionOpen) == false
            }
        }

        describe("an open sale") {
            beforeEach {
                saleArtwork.auction = Sale(json: ["auction_state": "open"])
            }

            it("returns isAuctionOpen as true") {
                expect(subject.isAuctionOpen) == true
            }
        }
    }
}
