import Foundation
import Interstellar

/// Network model responsible for fetching the Sale from the API.
class AuctionSaleNetworkModel {

    let saleID: String
    var sale: Sale?

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetchSale() -> Signal<Sale> {
        let signal = Signal(saleID)

        // Based on the saleID signal, fetch the sale
        return signal
            .flatMap(fetchSaleModel)
            .next { sale in
                self.sale = sale
            }
    }
}


/// Fetches sale based on saleID.
private func fetchSaleModel(saleID: String, callback: Result<Sale> -> Void) {
    ArtsyAPI.getSaleWithID(saleID,
        success: { sale in
            callback(.Success(sale))
        },
        failure: passOnFailure(callback)
    )
}
