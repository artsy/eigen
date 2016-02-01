import Foundation
import Interstellar

class AuctionNetworkModel {

    let saleID: String

    private let saleArtworksNetworkModel: AuctionSaleArtworksNetworkModel

    init(saleID: String) {
        self.saleID = saleID
        self.saleArtworksNetworkModel = AuctionSaleArtworksNetworkModel(saleID: saleID)
    }

    func fetch() -> Signal<SaleViewModel> {
        return saleArtworksNetworkModel.fetch()
    }
}
