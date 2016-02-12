import Quick
import Nimble
@testable
import Artsy

class SaleViewModelTests: QuickSpec {
    override func spec() {
        let sale = try! Sale(dictionary: ["name": "The 🎉 Sale"], error: Void())
        let saleArtworks = [
            testSaleArtworkEstimateAt(500),
            testSaleArtworkEstimateAt(1500)
        ]

        describe("pruning items when refining") {
            var subject: SaleViewModel!

            beforeEach {
                subject = SaleViewModel(sale: sale, saleArtworks: saleArtworks)
            }

            it("includes high and low inclusive") {
                let refinedArtworks = subject.refinedArtworks(AuctionRefineSettings(ordering: .LotNumber, range: (min: 500, max: 1500)))

                expect(refinedArtworks.count) == 2
            }

            it("excludes low low estimates") {
                let refinedArtworks = subject.refinedArtworks(AuctionRefineSettings(ordering: .LotNumber, range: (min: 1000, max: 1500)))

                expect(refinedArtworks.count) == 1
            }

            it("excludes high low estimates") {
                let refinedArtworks = subject.refinedArtworks(AuctionRefineSettings(ordering: .LotNumber, range: (min: 500, max: 1000)))

                expect(refinedArtworks.count) == 1
            }
        }

        it("calculates a lowEstimate range") {
            let subject = SaleViewModel(sale: sale, saleArtworks: saleArtworks)

            let range = subject.lowEstimateRange

            expect(range.min) == 500
            expect(range.max) == 1500
        }

        it("calculates a lowEstimate range when a lowEstimate is nil") {
            let nilInfestedSaleArtworks = saleArtworks + [testSaleArtworkEstimateAt(nil)]
            let subject = SaleViewModel(sale: sale, saleArtworks: nilInfestedSaleArtworks)

            expect(subject.lowEstimateRange).notTo( raiseException() )
        }

        it("calculates a lowEstimate range when all lowEstimates are nil") {
            let subject = SaleViewModel(sale: sale, saleArtworks: [testSaleArtworkEstimateAt(nil)])

            expect(subject.lowEstimateRange).notTo( raiseException() )
        }
    }
}

func testSaleArtworkEstimateAt(lowEstimate: Int?) -> SaleArtwork {
    return try! SaleArtwork(dictionary: [
        "saleArtworkID" : "sale-artwrrrrrk",
        "lowEstimateCents" : lowEstimate ?? NSNull(),
        "artwork" : [:]
        ], error: Void())
}