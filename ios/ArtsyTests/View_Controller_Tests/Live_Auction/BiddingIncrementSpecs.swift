import Quick
import Nimble
@testable
import Artsy

class BiddingIncrementSpecs: QuickSpec {
    class func spec() {
        it("should return the bid parameter if the list is empty") {
            let subject: [BidIncrementStrategy] = []

            expect(subject.minimumNextBidCentsIncrement(100)) == 100
        }

        describe("actual increments") {
            let subject: [BidIncrementStrategy] = [
                BidIncrementStrategy(json: ["from": 0, "amount": 25]),
                BidIncrementStrategy(json: ["from": 100, "amount": 50]),
                BidIncrementStrategy(json: ["from": 1_000, "amount": 500])
            ]

            it("works with the smallest increment") {
                expect(subject.minimumNextBidCentsIncrement(50)) == 75
            }

            it("works with the medium increment") {
                expect(subject.minimumNextBidCentsIncrement(500)) == 550
            }

            it("works with the largest increment") {
                expect(subject.minimumNextBidCentsIncrement(5_000)) == 5_500
            }

            it("works with an absurdly large number increment") {
                expect(subject.minimumNextBidCentsIncrement(5_000_000_000)) == 5_000_000_500

            }
        }

        describe("out of order increments") {
            let subject: [BidIncrementStrategy] = [
                BidIncrementStrategy(json: ["from": 0, "amount": 25]),
                BidIncrementStrategy(json: ["from": 1_000, "amount": 500]),
                BidIncrementStrategy(json: ["from": 100, "amount": 50])
            ]

            // It is the salesperson's job to sort these.
            it("gives incorrect output when array is not sorted, following principle of garbage-in-garbage-out") {
                expect(subject.minimumNextBidCentsIncrement(500)) != 550
            }
        }
    }
}
