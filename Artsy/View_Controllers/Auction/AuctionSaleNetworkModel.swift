import Foundation
import Interstellar

protocol AuctionSaleNetworkModelType {
    func fetchSale(saleID: String, callback: Result<Sale> -> Void)
}

/// Network model responsible for fetching the Sale from the API.
class AuctionSaleNetworkModel: AuctionSaleNetworkModelType {

    var sale: Sale?

    func fetchSale(saleID: String, callback: Result<Sale> -> Void) {

        // Based on the saleID signal, fetch the sale
        ArtsyAPI.getSaleWithID(saleID,
            success: { sale in
                self.sale = sale
                callback(.Success(sale))
            },
            failure: passOnFailure(callback)
        )
    }
}
