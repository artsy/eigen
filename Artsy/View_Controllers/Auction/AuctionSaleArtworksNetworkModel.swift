import Foundation
import Interstellar

protocol AuctionSaleArtworksNetworkModelType {
    func fetchSaleArtworks(_ saleID: String) -> Observable<Result<[SaleArtwork]>>
}

/// Network model responsible for fetching the SaleArtworks from the API.
class AuctionSaleArtworksNetworkModel: AuctionSaleArtworksNetworkModelType {
    func fetchSaleArtworks(_ saleID: String) -> Observable<Result<[SaleArtwork]>> {

        let observable = Observable<Result<[SaleArtwork]>>()

        /// Fetches all the sale artworks associated with the sale.
        /// This serves as a trampoline for the actual recursive call.
        fetchPage(1, forSaleID: saleID, alreadyFetched: []) { result in
            switch result {
            case .success(let saleArtworks):
                let filteredSaleArtworks = saleArtworks.filter { $0.artwork.published.boolValue }
                observable.update(.success(filteredSaleArtworks))
            case .error(let error):
                observable.update(.error(error))
            }
        }

        return observable
    }
}


/// Number of sale artworks to fetch at once.
private let pageSize = 100

/// Recursively calls itself with page+1 until the count of the returned array is < pageSize.
private func fetchPage(_ page: Int, forSaleID saleID: String, alreadyFetched: [SaleArtwork], callback: @escaping (Result<[SaleArtwork]>) -> Void) {
    ArtsyAPI.getSaleArtworks(withSale: saleID,
        page: page,
        pageSize: pageSize,
        success: { saleArtworks in
            let totalFetchedSoFar = alreadyFetched + saleArtworks

            if saleArtworks.count < pageSize {
                // We have reached the end of the sale artworks, stop recursing.
                callback(.success(totalFetchedSoFar))
            } else {
                // There are still more sale artworks, so recurse.
                let nextPage = page + 1
                fetchPage(nextPage, forSaleID: saleID, alreadyFetched: totalFetchedSoFar, callback: callback)
            }
        },
        failure: { error in
            callback(.error(error as Error))
        }
    )
}
