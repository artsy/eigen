import Foundation
import Interstellar

/// Network model for everything auction-related. 
/// It delegates out to other network models and doesn't itself perform any networking.
class AuctionNetworkModel {

    let saleID: String
    var saleViewModel: SaleViewModel?

    // Each one of these network models performs their request to fetch exactly one thing, and then store it locally.
    private let saleNetworkModel: AuctionSaleNetworkModel
    private let saleArtworksNetworkModel: AuctionSaleArtworksNetworkModel
    private let registrationStatusNetworkModel: AuctionRegistrationStatusNetworkModel

    init(saleID: String) {
        self.saleID = saleID
        self.saleNetworkModel = AuctionSaleNetworkModel(saleID: saleID)
        self.saleArtworksNetworkModel = AuctionSaleArtworksNetworkModel(saleID: saleID)
        self.registrationStatusNetworkModel = AuctionRegistrationStatusNetworkModel(saleID: saleID)
    }

    func fetch() -> Signal<SaleViewModel> {
        let signal = Signal(saleID)

        // We perform a series of network requests:
        // 1. Fetch the resgistration status. It's stored in that network model, we ignore it.
        // 2. Fetch the Sale model.
        // 3. Fetch the SaleArtwork models and merge them with the Sale.
        // Then we create the SaleViewModel, and store it locally in our ivar.
        let requestChain = signal
            .inject(registrationStatusNetworkModel.fetchRegistrationStatus())
            .flatMap { (_, callback) in
                // Fetch the Sale model.
                return self.saleNetworkModel.fetchSale().subscribe(callback)
            }
            .merge(saleArtworksNetworkModel.fetchSaleArtworks())
            .map { tuple in
                // Tuple has the Sale and [SaleArtwork] from previous network requests.
                return SaleViewModel(sale: tuple.0, saleArtworks: tuple.1)
            }
            .next { saleViewModel in
                // Store the SaleViewModel
                self.saleViewModel = saleViewModel
            }

        return requestChain
    }
}

extension AuctionNetworkModel {
    var registrationStatus: ArtsyAPISaleRegistrationStatus? {
        return self.registrationStatusNetworkModel.registrationStatus
    }
}
