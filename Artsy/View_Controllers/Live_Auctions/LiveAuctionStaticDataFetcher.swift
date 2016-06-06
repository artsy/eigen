import Foundation
import Interstellar
import SwiftyJSON

enum CausalityRole {
    case Bidder
    case Observer
}

class JWT {
    let string: String
    private let rawData: JSON

    init?(jwtString: String) {
        let components = jwtString.componentsSeparatedByString(".")
        if components.count != 3 { return nil }

        let body = components[1]

        // From our side, this is more complex than you'd hope WRT base64 decoding a string
        // for the full details: http://stackoverflow.com/a/21407393/385754

        let paddedLength = body.characters.count + (4 - (body.characters.count % 4));
        let correctBase64String = body.stringByPaddingToLength(paddedLength, withString:"=", startingAtIndex:0)

        guard let decodedData = NSData(base64EncodedString: correctBase64String, options:[.IgnoreUnknownCharacters]),
              let json = try? NSJSONSerialization.JSONObjectWithData(decodedData, options: [])
              else { return nil}

        rawData = JSON(json)
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
        return  JWT(jwtString: json["data"]["causality_jwt"].stringValue)
    }

    func parseBidderID(json: JSON) -> String? {
        return json["data"]["me"]["paddle_number"].string
    }

}
