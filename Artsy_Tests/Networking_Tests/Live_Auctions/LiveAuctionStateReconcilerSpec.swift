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
            state = test_liveAuctionJSON(.Active)
            subject = LiveAuctionStateReconciler(saleArtworks: [])
        }

        it("sends current lot") {
            var currentLot: LiveAuctionLotViewModelType?
            subject.currentLotSignal.subscribe { currentLot = $0 }

            subject.updateState(state)

            expect(currentLot).toNot( beNil() )
        }

        describe("on subsequent state update") {

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
