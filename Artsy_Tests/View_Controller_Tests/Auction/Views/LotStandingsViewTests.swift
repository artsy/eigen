import Quick
import Nimble
import Nimble_Snapshots
import UIKit
import Mantle
import Forgeries
@testable
import Artsy


class LotStandingsViewTests: QuickSpec {
    override func spec() {
        var sale: Sale!
        var saleViewModel: SaleViewModel!

        sharedExamples("looks good by default") { (context: @escaping SharedExampleContext) in
            var horizontalSizeClass: UIUserInterfaceSizeClass!
            var device: ARDeviceType!
            var isCompact: Bool = false

            let lotStandings: [LotStanding] = [
                test_LotStanding(highBidder: true, reserveMet: true),
                test_LotStanding(highBidder: true, reserveMet: false),
                test_LotStanding(highBidder: false, reserveMet: true)
            ]

            beforeEach {
                sale = try! Sale(dictionary: ["saleID": "the-tada-sale", "name": "The 🎉 Sale"], error: Void())
                saleViewModel = Test_SaleViewModel(sale: sale, saleArtworks: [], bidders: [], lotStandings: lotStandings)

                horizontalSizeClass = UIUserInterfaceSizeClass(rawValue: context()["horizontalSizeClass"] as! Int)
                device = ARDeviceType(rawValue: context()["device"] as! Int)
                isCompact = horizontalSizeClass == .compact
            }

            it("looks good") {
                let subject = LotStandingsView(saleViewModel: saleViewModel, isCompact: isCompact, lotStandingTappedClosure: { _ in })

                subject.stubHorizontalSizeClass(horizontalSizeClass)
                if isCompact {
                    subject.frame = CGRect(x: 0, y: 0, width: 320, height: 600)
                } else {
                    subject.frame = CGRect(x: 0, y: 0, width: 768, height: 800)
                }

                ARTestContext.use(device) {
                    expect(subject).to( haveValidSnapshot(usesDrawRect: true) )
                }
            }
        }

        describe("iPhone") {
            itBehavesLike("looks good by default") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.compact.rawValue, "device": ARDeviceType.phone5.rawValue] as NSDictionary
            }
        }

        describe("iPad") {
            itBehavesLike("looks good by default") {
                return ["horizontalSizeClass": UIUserInterfaceSizeClass.regular.rawValue, "device": ARDeviceType.pad.rawValue] as NSDictionary
            }
        }
    }
}

fileprivate func test_LotStanding(highBidder: Bool, reserveMet: Bool) -> LotStanding {
    let saleArtworkDictionary: NSDictionary = [
        "id": "some-sale-artwork-id",
        "lot_label": "1",
        "bidder_positions_count": 2,
        "highest_bid": [
            "amount_cents": 500_00,
            "bidId": "blah blah"
        ],
        "artwork": [
            "artist": [
                "name": "Todd"
            ],
            "year": "1999"
        ],
        "reserve_status": (reserveMet ? "reserve_met" : "reserve_not_met")
    ]
    let leadingPosition: Any = (highBidder ? ["something": "doesn't matter what"] : NSNull())

    return LotStanding(json: [
        "sale_artwork": saleArtworkDictionary,
        "leading_position": leadingPosition
        ])!
}
