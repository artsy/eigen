import Foundation
import Interstellar

protocol LiveAuctionStateFetcherType {
    func fetchSale() -> Observable<Result<AnyObject>>
}

class LiveAuctionStateFetcher: LiveAuctionStateFetcherType {
    let host: String
    let saleID: String

    init(host: String, saleID: String) {
        self.host = host
        self.saleID = saleID
    }

    func fetchSale() -> Observable<Result<AnyObject>> {
        let signal = Observable<Result<AnyObject>>()

        ArtsyAPI.getLiveSaleStateWithSaleID(saleID,
            host: host,
            success: { state in
                signal.update(.Success(state))
            },
            failure: { error in
                signal.update(.Error(error as ErrorType))
            })

        return signal
    }
    
}