import Foundation
import Interstellar
import SwiftyJSON
import JWTDecode

enum CausalityRole {
    case Bidder
    case Observer
}

class JWT {
    let string: String
    let rawData: JSON

    init?(jwtString: String) {

        guard let jwt = try? decode(jwtString) else { return nil }

        rawData = JSON(jwt.body)
        string = jwtString
    }

    var userID: String? {
        return rawData["userId"].string
    }

    var role: CausalityRole {
        switch rawData["role"].stringValue {
        case "bidder":
            return .Bidder
        // Fallback for unknown roles
        default:
            return .Observer
        }
    }
}

class BiddingCredentials {
    let bidders: [Bidder]
    let paddleNumber: String?

    var canBid: Bool {
        return bidders.isNotEmpty
    }

    var bidderID: String? {
        // TODO: pick a bidder, return id
        return ""
    }

    init(bidders: [Bidder], paddleNumber: String?) {
        self.bidders = bidders
        self.paddleNumber = paddleNumber
    }
}

typealias StaticSaleResult = Result<(sale: LiveSale, jwt: JWT, bidderCredentials: BiddingCredentials)>


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
        let role: String? = loggedIn ? "participant" : nil
        ArtsyAPI.getLiveSaleStaticDataWithSaleID(saleSlugOrID, role:role,
            success: { data in
                let json = JSON(data)
                guard let sale = self.parseSale(json) else {
                    return signal.update(.Error(Error.JSONParsing))
                }

                guard
                    let jwt = self.parseJWT(json) else {
                    return signal.update(.Error(Error.NoJWTCredentials))
                }

                let bidderCredentials = self.parseBidderCredentials(json)
                signal.update(.Success((sale: sale, jwt: jwt, bidderCredentials: bidderCredentials)))

            }, failure: { error in
                signal.update(.Error(error as ErrorType))
            })

        return signal
    }
}

extension LiveAuctionStaticDataFetcherType {

    func parseSale(json: JSON) -> LiveSale? {
        guard let saleJSON = json["data"]["sale"].dictionaryObject else { return nil }
        return LiveSale(JSON: saleJSON)
    }

    func parseJWT(json: JSON) -> JWT? {
        return JWT(jwtString: json["data"]["causality_jwt"].stringValue)
    }

    func parseBidderCredentials(json: JSON) -> BiddingCredentials {
        let paddleNumber = json["data"]["me"]["paddle_number"].string
        let bidders = json["data"]["me"]["bidders"].arrayValue.flatMap { bidder in
            return Bidder(JSON: bidder.dictionaryObject)
        }
        return BiddingCredentials(bidders: bidders, paddleNumber: paddleNumber)
    }

}
