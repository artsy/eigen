import Foundation
import Interstellar

protocol LiveAuctionStaticDataFetcherType {
    func fetchStaticData() -> Observable<Result<LiveSale>>
}

class LiveAuctionStaticDataFetcher: LiveAuctionStaticDataFetcherType {
    enum Error: ErrorType {
        case JSONParsing
    }

    let saleSlugOrID: String

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID
    }

    func fetchStaticData() -> Observable<Result<LiveSale>> {
        let signal = Observable<Result<LiveSale>>()

        ArtsyAPI.getLiveSaleStaticDataWithSaleID(saleSlugOrID,
            success: { json in
                guard let sale = self.parseSale(json) else {
                    return signal.update(.Error(Error.JSONParsing))
                }
                signal.update(.Success(sale))
            }, failure: { error in
                signal.update(.Error(error as ErrorType))
            })

        return signal
    }
    
}

extension LiveAuctionStaticDataFetcherType {

    func parseSale(json: AnyObject) -> LiveSale? {
        guard let data = json["data"] as? [String: [String: AnyObject]] else { return nil }
        guard let saleJSON = data["sale"] else { return nil }
        let sale = LiveSale(JSON: saleJSON)

        return sale
    }
}