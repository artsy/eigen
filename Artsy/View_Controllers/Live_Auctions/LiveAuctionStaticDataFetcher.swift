import Foundation
import Interstellar

typealias JWT = String
typealias StaticSaleResult = Result<(sale: LiveSale, jwt: JWT)>

protocol LiveAuctionStaticDataFetcherType {
    func fetchStaticData() -> Observable<StaticSaleResult>
}

class LiveAuctionStaticDataFetcher: LiveAuctionStaticDataFetcherType {
    enum Error: ErrorType {
        case JSONParsing
    }

    let saleSlugOrID: String

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID
    }

    func fetchStaticData() -> Observable<StaticSaleResult> {
        let signal = Observable<StaticSaleResult>()

        ArtsyAPI.getLiveSaleStaticDataWithSaleID(saleSlugOrID,
            success: { json in
                guard let
                    sale = self.parseSale(json),
                    jwt = self.parseJWT(json) else {
                    return signal.update(.Error(Error.JSONParsing))
                }

                signal.update(.Success((sale: sale, jwt: jwt)))
            }, failure: { error in
                signal.update(.Error(error as ErrorType))
            })

        return signal
    }

}

extension LiveAuctionStaticDataFetcherType {

    func parseSale(json: AnyObject) -> LiveSale? {
        guard let data = json["data"] as? [String: AnyObject] else { return nil }
        guard let saleJSON = data["sale"] as? [String: AnyObject] else { return nil }
        let sale = LiveSale(JSON: saleJSON)

        return sale
    }

    func parseJWT(json: AnyObject) -> JWT? {
        guard let data = json["data"] as? [String: AnyObject] else { return nil }
        guard let jwt = data["causality_jwt"] as? JWT else { return nil }

        return jwt
    }
}