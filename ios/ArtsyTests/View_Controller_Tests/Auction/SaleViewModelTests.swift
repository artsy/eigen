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

        it("returns correct banner image") {
            let url = "http://example.com"
            sale.setValue(["wide": url] as NSDictionary, forKey: "imageURLs")

            let subject = SaleViewModel(sale: sale, saleArtworks: saleArtworks, bidders: [], me: User())

            expect(subject.backgroundImageURL?.absoluteString) == url
        }

        it("returns correct avatar image") {
            let url = "http://example.com"
            sale.profile = try! Profile(dictionary:  ["iconURLs": ["square": url]], error: Void())

            let subject = SaleViewModel(sale: sale, saleArtworks: saleArtworks, bidders: [], me: User())

            expect(subject.profileImageURL?.absoluteString) == url
        }

        it("calculates a lowEstimate range") {
            let subject = SaleViewModel(sale: sale, saleArtworks: saleArtworks, bidders: [], me: User())

            let range = subject.lowEstimateRange

            expect(range.min) == 500
            expect(range.max) == 1500
        }

        it("calculates a lowEstimate range when a lowEstimate is nil") {
            let nilInfestedSaleArtworks = saleArtworks + [testSaleArtworkEstimateAt(nil)]
            let subject = SaleViewModel(sale: sale, saleArtworks: nilInfestedSaleArtworks, bidders: [], me: User())

            expect(subject.lowEstimateRange).notTo( raiseException() )
        }

        it("calculates a lowEstimate range when all lowEstimates are nil") {
            let subject = SaleViewModel(sale: sale, saleArtworks: [testSaleArtworkEstimateAt(nil)], bidders: [], me: User())

            expect(subject.lowEstimateRange).notTo( raiseException() )
        }

        it("deals with auctions that have not started ") {
            let sale = testSaleWithDates(NSDate.distantFuture as NSDate, end: NSDate.distantFuture as NSDate)
            let subject = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], me: User())

            expect(subject.saleAvailability).to( equal(  SaleAvailabilityState.notYetOpen ) )
        }

        it("deals with auctions that have finished ") {
            let sale = testSaleWithDates(NSDate.distantPast as NSDate, end: NSDate.distantPast as NSDate)
            let subject = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], me: User())

            expect(subject.saleAvailability).to( equal( SaleAvailabilityState.closed ) )
        }

        it("deals with auctions that are active ") {
            let sale = testSaleWithDates(NSDate.distantPast as NSDate, end: NSDate.distantFuture as NSDate)
            let subject = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], me: User())

            expect(subject.saleAvailability).to( equal( SaleAvailabilityState.active(liveAuctionDate: nil) ) )
        }


        it("deals with auctions that are active and live is upcoming") {
            let soon = NSDate().addingTimeInterval(1650.9)

            let sale = try! Sale(dictionary: ["name": "The 🎉 Sale", "startDate": NSDate.distantPast, "endDate": NSDate.distantFuture, "liveAuctionStartDate": soon, "saleState": NSNumber(value: SaleStatePreview.rawValue)], error: Void())

            let subject = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], me: User())

            expect(subject.saleAvailability).to( equal( SaleAvailabilityState.active(liveAuctionDate: soon as Date) ) )
        }

        it("lets user know the live auction is happening") {
            let before = NSDate().addingTimeInterval(-1650.9)

            let sale = try! Sale(dictionary: ["name": "The 🎉 Sale", "startDate": NSDate.distantPast, "endDate": NSDate.distantFuture, "liveAuctionStartDate": before, "saleState": NSNumber(value: SaleStateOpen.rawValue)], error: Void())

            let subject = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], me: User())

            expect(subject.isRunningALiveAuction) == true
            expect(subject.shouldShowLiveInterface) == true
        }

        it("lets doesn't direct the user to the live interface for completed sales.") {
            let before = NSDate().addingTimeInterval(-1650.9)
            let end = NSDate().addingTimeInterval(-100)

            let sale = try! Sale(dictionary: ["name": "The 🎉 Sale", "startDate": NSDate.distantPast, "endDate": end, "liveAuctionStartDate": before, "saleState": NSNumber(value: SaleStateClosed.rawValue)], error: Void())

            let subject = SaleViewModel(sale: sale, saleArtworks: [], bidders: [], me: User())

            expect(subject.shouldShowLiveInterface) == false
        }
    }
}

func testSaleWithDates(_ start: NSDate, end: NSDate) -> Sale {
    return try! Sale(dictionary: ["name": "The 🎉 Sale", "startDate": start, "endDate": end], error: Void())
}

func testLiveSaleWithStart(_ start: NSDate, end: NSDate) -> LiveSale {
    return try! LiveSale(dictionary: ["name": "The 🎉 Sale", "causalitySaleID": "some-random-string-of-nc72bjzj7", "startDate": start, "endDate": end, "saleArtworks": []], error: Void())
}

func testLiveSale() -> LiveSale {
    return try! LiveSale(dictionary: ["name": "The 🎉 Sale", "causalitySaleID": "some-random-string-of-nc72bjzj7", "saleArtworks": []], error: Void())
}

func testSaleArtworkEstimateAt(_ lowEstimate: Int?) -> SaleArtwork {
    let lowEstimateCents: Any = (lowEstimate ?? NSNull())
    let dictionary = [
        "saleArtworkID" : "sale-artwrrrrrk",
        "lowEstimateCents" : lowEstimateCents,
        "artwork" : [:]
        ]
    return try! SaleArtwork(dictionary: dictionary, error: Void())
}
