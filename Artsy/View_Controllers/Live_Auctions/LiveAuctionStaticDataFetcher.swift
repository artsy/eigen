import Foundation
import Interstellar

protocol LiveAuctionStaticDataFetcherType {
    func fetchStaticData() -> Observable<Result<AnyObject>>
}

class LiveAuctionStaticDataFetcher: LiveAuctionStaticDataFetcherType {
    let saleID: String

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetchStaticData() -> Observable<Result<AnyObject>> {
        let signal = Observable<Result<AnyObject>>()

        ArtsyAPI.getLiveSaleStaticDataWithSaleID(saleID,
            success: { state in
                signal.update(.Success(state))
            }, failure: { error in
                signal.update(.Error(error as ErrorType))
            })

        return signal
    }
    
}