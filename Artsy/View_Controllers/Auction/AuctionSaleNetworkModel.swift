import Foundation
import Interstellar

protocol AuctionSaleNetworkModelType {
    func fetchSale(saleID: String) -> Observable<Result<Sale>>
}

/// Network model responsible for fetching the Sale from the API.
class AuctionSaleNetworkModel: AuctionSaleNetworkModelType {

    var sale: Sale?

    func fetchSale(saleID: String) -> Observable<Result<Sale>> {
        let observable = Observable<Result<Sale>>()

        // Based on the saleID signal, fetch the sale
        ArtsyAPI.getSaleWithID(saleID,
            success: { sale in
                self.sale = sale
                observable.update(.Success(sale))
            },
            failure: { error in
                observable.update(.Error(error as ErrorType))
            })

        return observable
    }
}
