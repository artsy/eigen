import Foundation
import Interstellar
import SwiftyJSON


typealias JWT = String
typealias StaticSaleResult = Result<(sale: LiveSale, jwt: JWT, bidderID: String?)>


protocol LiveAuctionStaticDataFetcherType {
    func fetchStaticData() -> Observable<StaticSaleResult>
}

class LiveAuctionStaticDataFetcher: LiveAuctionStaticDataFetcherType {
    enum Error: ErrorType {
        case JSONParsing
        case NoJWTCredentials
    }

    let saleSlugOrID: String

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID
    }

    func fetchStaticData() -> Observable<StaticSaleResult> {
        let signal = Observable<StaticSaleResult>()
        let loggedIn = User.currentUser() != nil
        let role = loggedIn ? "bidder" : "observer"
        ArtsyAPI.getLiveSaleStaticDataWithSaleID(saleSlugOrID, role:role,
            success: { data in
                let json = JSON(data)
                guard let sale = self.parseSale(json) else {
                    return signal.update(.Error(Error.JSONParsing))
                }

                guard let
                    jwt = self.parseJWT(json) else {
                    return signal.update(.Error(Error.NoJWTCredentials))
                }

                let bidderID = self.parseBidderID(json)
                signal.update(.Success((sale: sale, jwt: jwt, bidderID: bidderID)))

            }, failure: { error in
                signal.update(.Error(error as ErrorType))
            })

        return signal
    }

}

extension LiveAuctionStaticDataFetcherType {

    func parseSale(json: JSON) -> LiveSale? {
        guard let saleJSON = json["data"]["sale"].dictionaryObject else { return nil }
        let sale = LiveSale(JSON: saleJSON)

        return sale
    }

    func parseJWT(json: JSON) -> JWT? {
        return json["data"]["causality_jwt"].string
    }

    func parseBidderID(json: JSON) -> String? {
        return json["data"]["me"]["paddle_number"].string
    }

}