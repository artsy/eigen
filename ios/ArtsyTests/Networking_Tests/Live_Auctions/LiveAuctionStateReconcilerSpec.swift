import Quick
import Nimble
import Interstellar
import Then
@testable
import Artsy


class LiveAuctionStateReconcilerSpec: QuickSpec {
    override func spec() {

        var state: NSMutableDictionary!
        var subject: LiveAuctionStateReconciler!
        let sale = stub_auctionSale()
        let creds = BiddingCredentials(bidders: [], paddleNumber: "", userID: "")
        let lots = sale.saleArtworks.map { LiveAuctionLotViewModel(lot: $0, bidderCredentials: creds) }

        beforeEach {
            state = ["fullLotStateById": [:]]
            subject = LiveAuctionStateReconciler(saleArtworks: lots)
        }

        it("doesn't send current lot if unspecified") {
            var currentLot: LiveAuctionLotViewModelType?
            subject.currentLotSignal.subscribe { currentLot = $0 }

            subject.updateState(state)

            expect(currentLot).to( beNil() )
        }

        describe("with a current lot") {

            beforeEach {
                state["currentLotId"] = lots[0].lotID
            }

            it("sends current lot") {
                subject.updateState(state)

                expect(subject.currentLotSignal.peek()).toNot( beNil() )
            }

            it("does not send current lot if it has not changed") {
                var currentLotInvocations = 0
                subject.currentLotSignal.subscribe { _ in currentLotInvocations += 1 }

                subject.updateState(state)
                subject.updateState(state)

                expect(currentLotInvocations) == 2 // Initial + upload + 0 (identical update)
            }

            it("sends new current lot when the lot changes") {
                var currentLotInvocations = 0
                subject.currentLotSignal.subscribe { _ in currentLotInvocations += 1 }
                let newState = NSMutableDictionary(dictionary: state)
                newState["currentLotId"] = lots[1].lotID

                subject.updateState(state)
                subject.updateState(newState)

                expect(currentLotInvocations) == 3 // Initial + update1 + update2
            }

            pending("updates lot view model with new events") {
            }

            pending("doesn't update lot view model with events that aren't new") {
            }

            pending("updates lot view model with asking price") {
            }

            pending("updates lot view model with reserve status") {
            }
        }
    }
}
