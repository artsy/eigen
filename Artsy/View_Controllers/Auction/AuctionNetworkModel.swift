import Foundation
import Interstellar

class AuctionNetworkModel {

    let saleID: String

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetch() -> Signal<SaleViewModel> {
        let signal = Signal(saleID)

        return signal.flatMap(fetchSale)
            .flatMap(fetchSaleArtworks)
    }
}

private extension AuctionNetworkModel {

    func fetchSale(saleID: String, callback: Result<Sale> -> Void) {
        ArtsyAPI.getSaleWithID(saleID,
            success: { sale in
                callback(.Success(sale))
            },
            failure: { error in
                callback(.Error(error))
            }
        )
    }

    func fetchSaleArtworks(sale: Sale, callback: Result<SaleViewModel> -> Void) {
        ArtsyAPI.getSaleArtworksWithSale(sale,
            success: { (saleArtworks) in
                let viewModel = SaleViewModel(sale: sale, saleArtworks: saleArtworks)
                callback(.Success(viewModel))
            },
            failure: { error in
                callback(.Error(error))
            }
        )
    }
}
