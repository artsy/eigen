import Foundation
import Interstellar

protocol AuctionSaleNetworkModelType {
    func fetchSale(_ saleID: String) -> Observable<Result<Sale>>
}

/// Network model responsible for fetching the Sale from the API.
class AuctionSaleNetworkModel: AuctionSaleNetworkModelType {

    var sale: Sale?

    func fetchSale(_ saleID: String) -> Observable<Result<Sale>> {
        let observable = Observable<Result<Sale>>()

        // Based on the saleID signal, fetch the sale
        ArtsyAPI.getSaleWithID(saleID,
            success: { [weak self] sale in
                self?.sale = sale
                observable.update(.success(sale))
            },
            failure: { error in
                observable.update(.error(error as Error))
            })

        return observable
    }
}
