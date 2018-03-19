import Foundation
import Interstellar
import SwiftyJSON
import JWTDecode

enum CausalityRole {
    case bidder
    case observer
}

class JWT {
    let string: String
    let rawData: JSON

    init?(jwtString: String) {

        guard let jwt = try? decode(jwt: jwtString) else { return nil }

        rawData = JSON(jwt.body)
        string = jwtString
    }

    var userID: String? {
        return rawData["userId"].string
    }

    var role: CausalityRole {
        switch rawData["role"].stringValue {
        case "bidder":
            return .bidder
        // Fallback for unknown roles
        default:
            return .observer
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
        return bidders.bestBidder?.bidderID
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
    enum Error: Swift.Error {
        case jsonParsing
        case noJWTCredentials
    }

    let saleSlugOrID: String

    init(saleSlugOrID: String) {
        self.saleSlugOrID = saleSlugOrID
    }

    func fetchStaticData() -> Observable<StaticSaleResult> {
        let signal = Observable<StaticSaleResult>()
        let loggedIn = User.current() != nil
        let role: String? = loggedIn ? "participant" : nil
        ArtsyAPI.getLiveSaleStaticData(withSaleID: saleSlugOrID, role:role,
            success: { data in
                let json = JSON(data)
                guard let sale = self.parseSale(json) else {
                    return signal.update(.error(Error.jsonParsing))
                }

                guard
                    let jwt = self.parseJWT(json) else {
                    return signal.update(.error(Error.noJWTCredentials))
                }

                let bidderCredentials = self.parseBidderCredentials(json)
                signal.update(.success((sale: sale, jwt: jwt, bidderCredentials: bidderCredentials)))

            }, failure: { error in
                signal.update(.error(error as Swift.Error))
            })

        return signal
    }
}

extension LiveAuctionStaticDataFetcherType {

    func parseSale(_ json: JSON) -> LiveSale? {
        guard let saleJSON = json["data"]["sale"].dictionaryObject else { return nil }
        return LiveSale(json: saleJSON)
    }

    func parseJWT(_ json: JSON) -> JWT? {
        return JWT(jwtString: json["data"]["causality_jwt"].stringValue)
    }

    func parseBidderCredentials(_ json: JSON) -> BiddingCredentials {
        let paddleNumber = json["data"]["me"]["paddle_number"].string
        let bidders = json["data"]["me"]["bidders"].arrayValue.compactMap { bidder in
            return Bidder(json: bidder.dictionaryObject)
        }
        return BiddingCredentials(bidders: bidders, paddleNumber: paddleNumber)
    }

}
