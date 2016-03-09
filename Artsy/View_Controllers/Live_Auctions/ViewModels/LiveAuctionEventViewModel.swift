import Foundation

class LiveAuctionEventViewModel : NSObject {
    let event: LiveEvent

    init(event:LiveEvent) {
        self.event = event
    }
}