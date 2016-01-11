import Foundation
import Result

// TODO: Yeah, so https://github.com/artsy/mobile/issues/65
class AuctionNetworkModel {
    let saleID: String

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetchSale(callback: Result<Sale, NSError> -> Void) {
        ArtsyAPI.getSaleWithID(saleID,
            success: { sale in
                callback(.Success(sale))
            },
            failure: { error in
                callback(.Failure(error))
            }
        )
    }
}
