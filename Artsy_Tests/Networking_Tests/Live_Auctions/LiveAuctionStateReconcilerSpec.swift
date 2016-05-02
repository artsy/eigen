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
        var newLotsCalled: Bool!

        beforeEach {
            state = test_liveAuctionJSON(.Active)

            newLotsCalled = false
            subject = LiveAuctionStateReconciler()
            subject.newLotsSignal.subscribe { _ in newLotsCalled = true}
        }

        it("doesn't do anything if there are no lots") {
            state["lots"] = nil

            subject.updateState(state)

            expect(newLotsCalled) == false
        }

        it("doesn't do anything if there is no sale") {
            state["sale"] = nil

            subject.updateState(state)

            expect(newLotsCalled) == false
        }

        it("doesn't do anything if there are no sale's lots") {
            var sale = state["sale"] as! [String : AnyObject]
            sale["lots"] = nil
            state["sale"] = sale

            subject.updateState(state)

            expect(newLotsCalled) == false
        }

        it("doesn't do anything if there is no current lot id") {
            state["currentLotId"] = nil

            subject.updateState(state)

            expect(newLotsCalled) == false
        }

        it("doesn't do anything if there are no lot events (list is empty)") {
            // Events are already empty
            var newEventsCalled = false
            subject.newLotsSignal.subscribe { newLots in
                newLots.forEach { $0.newEventSignal.subscribe { _ in newEventsCalled = true } }
            }

            subject.updateState(state)

            expect(newEventsCalled) == false
        }

        it("sends fresh lots on first update") {
            var lots: [LiveAuctionLotViewModelType]?
            subject.newLotsSignal.subscribe { lots = $0 }

            subject.updateState(state)

            expect(lots?.count) == 3
        }

        it("sends current lot") {
            var currentLot: LiveAuctionLotViewModelType?
            subject.currentLotSignal.subscribe { currentLot = $0 }

            subject.updateState(state)

            expect(currentLot).toNot( beNil() )
        }

        it("orders lots correctly") {
            var lots: [LiveAuctionLotViewModelType]?
            subject.newLotsSignal.subscribe { lots = $0 }

            subject.updateState(state)

            let reconciledLotIDs = lots?.map { lot in
                return lot.liveAuctionLotID
            }

            let lotIDs = (state["sale"] as! [String : AnyObject])["lots"] as! [String]
            expect(lotIDs) == reconciledLotIDs
        }

        describe("on subsequent state update") {

            it("does not send lots") {
                var newLotsInvocation = 0
                subject.newLotsSignal.subscribe { _ in newLotsInvocation += 1 }

                subject.updateState(state)
                subject.updateState(state)

                expect(newLotsInvocation) == 1
            }

            it("does not send sale") {
                var saleInvocation = 0
                subject.saleSignal.subscribe { _ in saleInvocation += 1 }

                subject.updateState(state)
                subject.updateState(state)

                expect(saleInvocation) == 1
            }

            it("does not send current lot if it has not changed") {
                var currentLotInvocations = 0
                subject.currentLotSignal.subscribe { _ in currentLotInvocations += 1 }

                subject.updateState(state)
                subject.updateState(state)

                expect(currentLotInvocations) == 1
            }

            it("sends new current lot when the lot changes") {
                var currentLotInvocations = 0
                subject.currentLotSignal.subscribe { _ in currentLotInvocations += 1 }
                let newState = NSMutableDictionary(dictionary: state)
                let sale = newState["sale"] as! [String: AnyObject]
                newState["currentLotId"] = (sale["lots"] as! [String]).last

                subject.updateState(state)
                subject.updateState(newState)

                expect(currentLotInvocations) == 2
            }

            it("updates lot view model with new events") {
                var eventInvocations = 0
                subject.newLotsSignal.subscribe { newLots in
                    newLots.forEach { lot in
                        lot.newEventSignal.subscribe { _ in eventInvocations += 1 }
                    }
                }
                let newState = NSMutableDictionary(dictionary: state)
                var lots = newState["lots"] as! [String: [String : AnyObject]]
                var lot = Array(lots.values)[0]
                let event = test_liveAuctionLotEventJSON()
                lot["events"] = [event.id]
                lots[lot["id"]! as! String] = lot
                newState["lots"] = lots
                newState["lotEvents"] = event.json

                subject.updateState(state)
                subject.updateState(newState)

                expect(eventInvocations) == 1
            }

            it("doesn't update lot view model with events that aren't new") {
                var eventInvocations = 0
                subject.newLotsSignal.subscribe { newLots in
                    newLots.forEach { lot in
                        lot.newEventSignal.subscribe { _ in eventInvocations += 1 }
                    }
                }
                let newState = NSMutableDictionary(dictionary: state)
                var lots = state["lots"] as! [String: [String : AnyObject]]
                var lot = Array(lots.values)[0]
                let event = test_liveAuctionLotEventJSON()
                lot["events"] = [event.id]
                lots[lot["id"]! as! String] = lot
                newState["lots"] = lots
                newState["lotEvents"] = event.json

                subject.updateState(state)
                subject.updateState(newState)

                expect(eventInvocations) == 1
            }

            it("updates lot view model with online asking price") {
                var onlineAskingPriceInvocations = 0
                subject.newLotsSignal.subscribe { newLots in
                    newLots.forEach { lot in
                        lot.askingPriceSignal.subscribe { _ in onlineAskingPriceInvocations += 1 }
                    }
                }
                let newState = NSMutableDictionary(dictionary: state)
                var lots = newState["lots"] as! [String: [String : AnyObject]]
                var lot = Array(lots.values)[0]
                lot["onlineAskingPriceCents"] = 123456
                lots[lot["id"]! as! String] = lot
                newState["lots"] = lots

                subject.updateState(state)
                subject.updateState(newState)

                expect(onlineAskingPriceInvocations) == 4 // 3 lots + 1 updated asking price
            }

            it("updates lot view model with reserve status") {
                var reserveStatusUpdates = 0
                subject.newLotsSignal.subscribe { newLots in
                    newLots.forEach { lot in
                        lot.reserveStatusSignal.subscribe { _ in reserveStatusUpdates += 1 }
                    }
                }
                let newState = NSMutableDictionary(dictionary: state)
                var lots = newState["lots"] as! [String: [String : AnyObject]]
                var lot = Array(lots.values)[0]
                lot["reserveStatus"] = "reserve_not_met"
                lots[lot["id"]! as! String] = lot
                newState["lots"] = lots

                subject.updateState(state)
                subject.updateState(newState)

                expect(reserveStatusUpdates) == 4 // 3 lots + 1 updated reserve status
            }
            
            it("sends lots when number of lots change") {
                var currentLots: [LiveAuctionLotViewModelType]?
                subject.newLotsSignal.subscribe { currentLots = $0 }

                subject.updateState(state)
                subject.updateState(test_liveAuctionJSON(.Active, numberOfLots: 4))

                expect(currentLots?.count) == 4
            }

            it("sends updated sale availability if changed") {
                var saleAvailabilityInvocations = 0
                subject.saleSignal.subscribe { sale in
                    sale.saleAvailabilitySignal.subscribe { _ in saleAvailabilityInvocations += 1 }
                }

                subject.updateState(state)
                subject.updateState(test_liveAuctionJSON(.Closed))

                expect(saleAvailabilityInvocations) == 2
            }

            it("doesn't send updated sale availability if not changed") {
                var saleAvailabilityInvocations = 0
                subject.saleSignal.subscribe { sale in
                    sale.saleAvailabilitySignal.subscribe { _ in saleAvailabilityInvocations += 1 }
                }

                subject.updateState(state)
                subject.updateState(test_liveAuctionJSON(.Active, numberOfLots: 4))

                expect(saleAvailabilityInvocations) == 1
            }
        }
    }
}

private let dateFormatter = NSDateFormatter().then {
    $0.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
}

func test_liveAuctionJSON(saleAvailability: SaleAvailabilityState, numberOfLots: Int = 3) -> NSMutableDictionary {
    let startDate: NSDate
    let endDate: NSDate

    let hourAgo = NSDate().dateByAddingTimeInterval(-3600)
    let twoHoursAgo = hourAgo.dateByAddingTimeInterval(-3600)
    let hourFromNow = NSDate().dateByAddingTimeInterval(3600)
    let twoHoursFromNow = hourFromNow.dateByAddingTimeInterval(3600)

    switch saleAvailability {
    case .Active:
        startDate = hourAgo
        endDate = hourFromNow
    case .Closed:
        startDate = twoHoursAgo
        endDate = hourAgo
    case .NotYetOpen:
        startDate = hourFromNow
        endDate = twoHoursFromNow
    }

    let lots = Array(0..<numberOfLots).map { _ in test_liveAuctionLotJSON() }
    let lotIDs = Array(lots.map { (lot) -> String in
        return Array(lot.keys)[0]
    })

    let sale: NSDictionary =  [
        "id": "consectetur-quas-in-cupiditate-sint-omnis",
        "name": "Test Live Auction",
        "description": "Test Live Auction description.",
        "startAt": dateFormatter.stringFromDate(startDate),
        "endAt": dateFormatter.stringFromDate(endDate),
        "lots": lotIDs,
        "currentLotId": lotIDs[1] // Middle lot is current
        ]

    return ([
        "sale": sale,
        "lotEvents": [
            : // Empty lot events
        ],
        "lots": lots.reduce([:], combine: +),
        "currentLotId": lotIDs[1],
    ] as NSMutableDictionary)
}

func test_liveAuctionLotJSON() -> [String: [String: AnyObject]] {
    let id = "test_artwork_id\(random())"
    return [
        id: [
            "id": id,
            "position": 12,
            "currency": "USD",
            "symbol": "$",
            "reserveStatus": "reserve_met",
            "lowEstimateCents": 260000,
            "highEstimateCents": 390000,
            "askingPriceCents": 130000,
            "onlineAskingPriceCents": 130000,
            "artwork": [
                "title": "Perspiciatis autem consectetur molestias",
                "image": [
                    "large": [
                        "width": 600,
                        "height": 447,
                        "url": "https://i.embed.ly/1/display/resize?grow=false&url=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FXkAtGqcI3DTjapCjtOhI2Q%2Flarge.jpg&width=600&height=447&key=a1f82558d8134f6cbebceb9e67d04980&quality=95"
                    ],
                    "thumb": [
                        "width": 50,
                        "height": 50,
                        "url": "https://i.embed.ly/1/display/resize?grow=false&url=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FXkAtGqcI3DTjapCjtOhI2Q%2Flarge.jpg&width=600&height=447&key=a1f82558d8134f6cbebceb9e67d04980&quality=95"
                    ]
                ],
                "artwork": [
                    "title": "Perspiciatis autem consectetur molestias",
                    "image": [
                        "large": [
                            "width": 600,
                            "height": 447,
                            "url": "https://i.embed.ly/1/display/resize?grow=false&url=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FXkAtGqcI3DTjapCjtOhI2Q%2Flarge.jpg&width=600&height=447&key=a1f82558d8134f6cbebceb9e67d04980&quality=95"
                        ],
                        "thumb": [
                            "width": 50,
                            "height": 50,
                            "url": "https://i.embed.ly/1/display/resize?grow=false&url=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FXkAtGqcI3DTjapCjtOhI2Q%2Flarge.jpg&width=600&height=447&key=a1f82558d8134f6cbebceb9e67d04980&quality=95"
                        ]
                    ]
                ],
                "artist": [
                    "name": "Orville Simonis"
                ]
            ],
            "events": [
                
            ]
        ]
    ]
}

func test_liveAuctionLotEventJSON() -> (id: String, json: AnyObject) {
    let id = "test_event_id\(random())"
    return (id: id, json: [
        id: [
            "id": id,
            "type": "bid",
            "amountCents": 450000,
            "source": "floor",
            "isConfirmed": true
        ]
    ])
}
