import Foundation
import Interstellar

protocol LiveAuctionStaticDataFetcherType {
    func fetchStaticData() -> Signal<AnyObject>
}

class LiveAuctionStaticDataFetcher: LiveAuctionStaticDataFetcherType {
    let saleID: String

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetchStaticData() -> Signal<AnyObject> {
        let signal = Signal<AnyObject>()

        ArtsyAPI.getLiveSaleStaticDataWithSaleID(saleID,
            host: "http://metaphysics-staging.artsy.net",
            success: { state in
                signal.update(state)
            }, failure: { error in
                signal.update(error as ErrorType)
            })

        return signal
    }
    
}