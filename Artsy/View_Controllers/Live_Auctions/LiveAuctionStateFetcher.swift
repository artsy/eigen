import Foundation
import Interstellar

protocol LiveAuctionStateFetcherType {
    func fetchSale() -> Signal<AnyObject>
}

class LiveAuctionStateFetcher: LiveAuctionStateFetcherType {
    let host: String
    let saleID: String

    init(host: String, saleID: String) {
        self.host = host
        self.saleID = saleID
    }

    func fetchSale() -> Signal<AnyObject> {
        let signal = Signal<AnyObject>()

        ArtsyAPI.getLiveSaleStateWithSaleID(saleID,
            host: host,
            success: { state in
                signal.update(state)
            },
            failure: { error in
                signal.update(error as ErrorType)
            })

        return signal
    }
    
}