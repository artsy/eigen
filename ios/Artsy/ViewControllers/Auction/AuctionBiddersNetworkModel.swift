import Foundation
import Interstellar

protocol AuctionBiddersNetworkModelType {
    func fetchBiddersForSale(_ saleID: String) -> Observable<Result<[Bidder]>>
    var bidders: [Bidder] { get }
}

/// Network model responsible for fetching the registration status from the API.
class AuctionBiddersNetworkModel: AuctionBiddersNetworkModelType {

    fileprivate(set) var bidders: [Bidder] = []

    func fetchBiddersForSale(_ saleID: String) -> Observable<Result<[Bidder]>> {
        let observable = Observable<Result<[Bidder]>>()

        // Based on the saleID signal, fetch the sale registration status.
        ArtsyAPI.getCurrentUserBidders(forSale: saleID,
            success: { [weak self] bidders in
                self?.bidders = bidders
                observable.update(.success(bidders))
            }, failure: { error in
                observable.update(.error(error as Error))
            })

        return observable
    }
}
