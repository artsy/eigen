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

        beforeEach {
            state = ["fullLotStateById": [:]]
            subject = LiveAuctionStateReconciler(saleArtworks: [])
        }

        it("doesn't send current lot if unspecified") {
            var currentLot: LiveAuctionLotViewModelType?
            subject.currentLotSignal.subscribe { currentLot = $0 }

            subject.updateState(state)

            expect(currentLot).to( beNil() )
        }

        describe("with a current lot") {

            beforeEach {
                state["currentLotId"] = "54c7ecc27261692b5e420600"
            }

            pending("sends current lot") {
                state["currentLotId"] = "54c7ecc27261692b5e420600"
                var currentLot: LiveAuctionLotViewModelType?
                subject.currentLotSignal.subscribe { currentLot = $0 }

                subject.updateState(state)

                expect(currentLot).toNot( beNil() )
            }

            pending("does not send current lot if it has not changed") {
                var currentLotInvocations = 0
                subject.currentLotSignal.subscribe { _ in currentLotInvocations += 1 }

                subject.updateState(state)
                subject.updateState(state)

                expect(currentLotInvocations) == 1
            }

            pending("sends new current lot when the lot changes") {
                var currentLotInvocations = 0
                subject.currentLotSignal.subscribe { _ in currentLotInvocations += 1 }
                let newState = NSMutableDictionary(dictionary: state)
                newState["currentLotId"] = "zomg-a-new-id"

                subject.updateState(state)
                subject.updateState(newState)

                expect(currentLotInvocations) == 2
            }

            pending("updates lot view model with new events") {

            }

            pending("doesn't update lot view model with events that aren't new") {

            }

            pending("updates lot view model with online asking price") {

            }

            pending("updates lot view model with reserve status") {

            }
        }
    }
}
