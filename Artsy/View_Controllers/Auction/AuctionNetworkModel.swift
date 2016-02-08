import Foundation
import Interstellar

/// Network model for everything auction-related. 
/// It delegates out to other network models and doesn't itself perform any networking.
class AuctionNetworkModel {

    let saleID: String
    var saleViewModel: SaleViewModel?

    // Each one of these network models performs their request to fetch exactly one thing, and then store it locally.
    lazy var saleNetworkModel: AuctionSaleNetworkModelType = AuctionSaleNetworkModel()
    lazy var saleArtworksNetworkModel: AuctionSaleArtworksNetworkModelType = AuctionSaleArtworksNetworkModel()
    lazy var registrationStatusNetworkModel: AuctionRegistrationStatusNetworkModelType = AuctionRegistrationStatusNetworkModel()

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetch() -> Signal<SaleViewModel> {
        let signal = Signal(saleID)

        let fetchRegistrationStatus = signal.flatMap(registrationStatusNetworkModel.fetchRegistrationStatus)
        let fetchSale = signal.flatMap(saleNetworkModel.fetchSale)
        let fetchSaleArtworks = signal.flatMap(saleArtworksNetworkModel.fetchSaleArtworks)

        let createViewModel = fetchSale.merge(fetchSaleArtworks)
            .map { tuple in
                // Tuple has the Sale and [SaleArtwork] from previous network requests.
                return SaleViewModel(sale: tuple.0, saleArtworks: tuple.1)
            }
            .next { saleViewModel in
                // Store the SaleViewModel
                self.saleViewModel = saleViewModel 
            }

        return fetchRegistrationStatus.flatMap { (_, callback) in // Note we discard the status, we don't care.
            createViewModel.subscribe(callback)
        }
    }
}

extension AuctionNetworkModel {
    var registrationStatus: ArtsyAPISaleRegistrationStatus? {
        return self.registrationStatusNetworkModel.registrationStatus
    }
}
