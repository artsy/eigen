import Quick
import Nimble
@testable
import Artsy

class LiveSalesPersonSpecs: QuickSpec {
    override func spec() {
        it("sorts the bid increments take from the sale") {
            let sale = try! LiveSale(json: [
                "name": "The 🎉 Sale",
                "_id": "some-random-string-of-nc72bjzj7",
                "sale_artworks": [],
                "start_at": "2024-03-06T17:00:00.000+00:00",
                "bid_increments": [
                    ["from": 100, "amount": 50],
                    ["from": 0, "amount": 25] // Intentional out of order.
                ]], error: Void())

            let subject = LiveAuctionsSalesPerson(sale: sale, jwt: StubbedCredentials.registered.jwt, biddingCredentials: BiddingCredentials(bidders: [], paddleNumber: nil))

            expect(subject.bidIncrements) == subject.bidIncrements.sorted()
        }
    }
}
