import Interstellar
import SwiftyJSON

// swiftlint:disable force_unwrapping

/// Used to stub data from a JSON file stored in the app bundle, in lieu of fetching data from the server.
/// Userful for offline development, debugging, and testing.
class Stubbed_StaticDataFetcher: LiveAuctionStaticDataFetcherType {

    var bidders: [Bidder] = []
    var paddleNumber: String = "123456"

    init() {
        if let bidder = try? Bidder(dictionary: ["qualifiedForBidding": true, "bidderID": "123456"], error: Void()) {
            bidders = [bidder]
        }
    }

    func fetchStaticData() -> Observable<StaticSaleResult> {
        let signal = Observable<StaticSaleResult>()

        let json = loadJSON("live_auctions_static")
        let sale = self.parseSale(JSON(json))!
        let bidderCredentials = BiddingCredentials(bidders: bidders, paddleNumber: paddleNumber)

        let stubbedJWT = JWT(jwtString: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJvYnNlcnZlciIsInVzZXJJZCI6bnVsbCwic2FsZUlkIjoiNTRjN2U4ZmE3MjYxNjkyYjVhY2QwNjAwIiwiYmlkZGVySWQiOm51bGwsImlhdCI6MTQ2NTIzNDI2NDI2N30.2q3bh1E897walHdSXIocGKElbxOhCGmCCsL8Bf-UWNA")!
        let s = (sale: sale, jwt: stubbedJWT, bidderCredentials: bidderCredentials)
        signal.update(Result.success(s))

        return signal
    }
}

func loadJSON(_ filename: String) -> AnyObject {
    let jsonPath = Bundle.main.path(forResource: filename, ofType: "json")
    let jsonData = try! Data(contentsOf: URL(fileURLWithPath: jsonPath!))
    let json = try? JSONSerialization.jsonObject(with: jsonData, options: .allowFragments)

    return json as AnyObject
}
