import Foundation
import Interstellar

protocol AuctionBiddersNetworkModelType {
    func fetchRegistrationStatus(saleID: String) -> Observable<Result<[Bidder]>>
    var bidders: [Bidder] { get }
}

/// Network model responsible for fetching the registration status from the API.
class AuctionBiddersNetworkModel: AuctionBiddersNetworkModelType {

    private(set) var bidders: [Bidder] = []

    func fetchRegistrationStatus(saleID: String) -> Observable<Result<[Bidder]>> {
        let observable = Observable<Result<[Bidder]>>()

        // Based on the saleID signal, fetch the sale registration status.
        ArtsyAPI.getCurrentUserBiddersForSale(saleID,
            success: { bidders in
                self.bidders = bidders
                observable.update(.Success(bidders))
            }, failure: { error in
                observable.update(.Error(error as ErrorType))
            })

        return observable
    }
}
