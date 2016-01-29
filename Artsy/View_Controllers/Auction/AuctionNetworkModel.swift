import Foundation
import Interstellar

class AuctionNetworkModel {

    let saleID: String

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetch() -> Signal<SaleViewModel> {
        let signal = Signal(saleID)

        // Based on the saleID signal, fetch the sale, then pass that result on to fetch the sale artworks.
        return signal
            .flatMap(fetchSale)
            .flatMap(fetchSaleArtworks)
    }
}

/// Number of sale artworks to fetch at once.
private let PageSize = 10

private extension AuctionNetworkModel {

    /// Fetches sale based on saleID.
    func fetchSale(saleID: String, callback: Result<Sale> -> Void) {
        ArtsyAPI.getSaleWithID(saleID,
            success: { sale in
                callback(.Success(sale))
            },
            failure: passOnFailure(callback)
        )
    }

    /// Fetches all the sale artworks associated with the sale.
    /// This serves as a trampoline for the actual recursive call.
    func fetchSaleArtworks(sale: Sale, callback: Result<SaleViewModel> -> Void) {
        fetchPage(1, forSale: sale, alreadyFetched: []) { result in
            switch result {
            case .Success(let saleArtworks):
                let viewModel = SaleViewModel(sale: sale, saleArtworks: saleArtworks)
                callback(.Success(viewModel))
            case .Error(let error):
                callback(.Error(error))
            }
        }
    }

    /// Recursively calls itself with page+1 until the count of the returned array is < pageSize.
    func fetchPage(page: Int, forSale sale: Sale, alreadyFetched: [SaleArtwork], callback: Result<[SaleArtwork]> -> Void) {
        ArtsyAPI.getSaleArtworksWithSale(sale,
            page: page,
            pageSize: PageSize,
            success: { saleArtworks in
                let totalFetchedSoFar = alreadyFetched + saleArtworks

                if saleArtworks.count < PageSize {
                    // We have reached the end of the sale artworks, stop recursing.
                    callback(.Success(totalFetchedSoFar))
                } else {
                    // There are still more sale artworks, so recurse.
                    let nextPage = page + 1
                    self.fetchPage(nextPage, forSale: sale, alreadyFetched: totalFetchedSoFar, callback: callback)
                }
            },
            failure: passOnFailure(callback)
        )
    }
}

// Convenience function for invoking callback with the given error.
private func passOnFailure<T>(callback: Result<T> -> Void) -> (NSError!) -> Void {
    return { error in
        callback(.Error(error))
    }
}
