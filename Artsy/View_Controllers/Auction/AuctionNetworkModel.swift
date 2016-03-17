import Foundation
import Interstellar

protocol AuctionNetworkModelType {
    func fetch() -> Signal<SaleViewModel>
    func fetchRegistrationStatus() -> Signal<ArtsyAPISaleRegistrationStatus>
    
    var registrationStatus: ArtsyAPISaleRegistrationStatus? { get }
}

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
}

extension AuctionNetworkModel: AuctionNetworkModelType {
    var registrationStatus: ArtsyAPISaleRegistrationStatus? {
        return self.registrationStatusNetworkModel.registrationStatus
    }

    func fetchRegistrationStatus() -> Signal<ArtsyAPISaleRegistrationStatus> {
        let signal = Signal(saleID)
        return signal.flatMap(registrationStatusNetworkModel.fetchRegistrationStatus)
    }

    func fetch() -> Signal<SaleViewModel> {
        let signal = Signal(saleID)

        let fetchSale = signal.flatMap(saleNetworkModel.fetchSale)
        let fetchSaleArtworks = signal.flatMap(saleArtworksNetworkModel.fetchSaleArtworks)

        let createViewModel = fetchSale.merge(fetchSaleArtworks)
            .map { tuple -> SaleViewModel in
                // Tuple has the Sale and [SaleArtwork] from previous network requests.

                let sale = tuple.0
                let saleArtworks = tuple.1

                saleArtworks.forEach { $0.auction = sale }
                return SaleViewModel(sale: sale, saleArtworks: saleArtworks)
            }
            .next { saleViewModel in
                // Store the SaleViewModel
                self.saleViewModel = saleViewModel
        }

        return fetchRegistrationStatus().flatMap { (_, callback) in // Note we discard the status, we don't care.
            createViewModel.subscribe(callback)
        }
    }
}
