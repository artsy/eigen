import Foundation

// TODO: This should be removed when we decide on architecture in https://github.com/artsy/mobile/issues/65
enum Result<T> {
    case Success(T)
    case Failure(ErrorType)
}

// TODO: Yeah, so https://github.com/artsy/mobile/issues/65
class AuctionNetworkModel {

    let saleID: String

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetchSale(callback: Result<Sale> -> Void) {
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
