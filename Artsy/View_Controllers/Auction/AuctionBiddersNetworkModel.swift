import Foundation
import Interstellar

protocol AuctionBiddersNetworkModelType {
    func fetchBiddersForSale(saleID: String) -> Observable<Result<[Bidder]>>
    var bidders: [Bidder] { get }
}

/// Network model responsible for fetching the registration status from the API.
class AuctionBiddersNetworkModel: AuctionBiddersNetworkModelType {

    private(set) var bidders: [Bidder] = []

    func fetchBiddersForSale(saleID: String) -> Observable<Result<[Bidder]>> {
        let observable = Observable<Result<[Bidder]>>()

        // Based on the saleID signal, fetch the sale registration status.
        ArtsyAPI.getCurrentUserBiddersForSale(saleID,
            success: { [weak self, weak observable] bidders in
                self?.bidders = bidders
                observable?.update(.Success(bidders))
            }, failure: { [weak observable] error in
                observable?.update(.Error(error as ErrorType))
            })

        return observable
    }
}
