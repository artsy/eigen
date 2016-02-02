import Foundation
import Interstellar

/// Network model responsible for fetching the Sale from the API.
class AuctionSaleNetworkModel {

    var sale: Sale?

    func fetchSale(saleID: String, callback: Result<Sale> -> Void) {

        // Based on the saleID signal, fetch the sale
        ArtsyAPI.getSaleWithID(saleID,
            success: { sale in
                callback(.Success(sale))
            },
            failure: passOnFailure(callback)
        )
    }
}
