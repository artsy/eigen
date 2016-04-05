import Foundation
import Interstellar

protocol LiveAuctionStaticDataFetcherType {
    func fetchStaticData() -> Signal<[SaleArtwork]>
}

class LiveAuctionStaticDataFetcher: LiveAuctionStaticDataFetcherType {
    let saleID: String

    enum Error: ErrorType {
        case JSONParsing
    }

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetchStaticData() -> Signal<[SaleArtwork]> {
        let signal = Signal<[SaleArtwork]>()

        ArtsyAPI.getLiveSaleStaticDataWithSaleID(saleID,
            success: { json in
                guard let saleArtworks = self.parseSaleArtworks(json) else {
                    return signal.update(Error.JSONParsing)
                }
                signal.update(saleArtworks)
            }, failure: { error in
                signal.update(error as ErrorType)
            })

        return signal
    }
}

extension LiveAuctionStaticDataFetcherType {
    func parseSaleArtworks(json: AnyObject) -> [SaleArtwork]? {

        guard let data = json["data"] as? [String: [String: AnyObject]] else { return nil }
        guard let sale = data["sale"] else { return nil }
        guard let saleArtworksJSON = sale["sale_artworks"] as? [[String: AnyObject]] else { return nil }
        let saleArtworks = saleArtworksJSON.flatMap { SaleArtwork(JSON: $0) }

        return saleArtworks
    }
}
