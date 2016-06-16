import Quick
import Nimble
@testable
import Artsy

class LiveSalesPersonSpecs: QuickSpec {
    override func spec() {
        it("sorts the bid increments take from the sale") {
            let sale = try! LiveSale(JSON: [
                "name": "The 🎉 Sale",
                "_id": "some-random-string-of-nc72bjzj7",
                "sale_artworks": [],
                "bid_increments": [
                    ["from": 100, "amount": 50],
                    ["from": 0, "amount": 25] // Intentional out of order.
                ]], error: Void())

            let subject = LiveAuctionsSalesPerson(sale: sale, jwt: StubbedCredentials.Registered.jwt, biddingCredentials: BiddingCredentials(bidders: [], paddleNumber: nil))

            expect(subject.bidIncrements) == subject.bidIncrements.sort()
        }
    }
}
