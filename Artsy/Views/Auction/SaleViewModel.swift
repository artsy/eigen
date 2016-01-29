import Foundation

class SaleViewModel {
    private let sale: Sale
    private let saleArtworks: [SaleArtwork]

    init(sale: Sale, saleArtworks: [SaleArtwork]) {
        self.sale = sale
        self.saleArtworks = saleArtworks
    }
}

extension SaleViewModel {
    var backgroundImageURL: NSURL! {
        return NSURL(string: "https://d32dm0rphc51dk.cloudfront.net/BLv_dHIIVvShtDB8GCxFdg/large_rectangle.jpg")!
    }

    var profileImageURL: NSURL! {
        return NSURL(string: "https://d32dm0rphc51dk.cloudfront.net/n9QgQtio1Rrp-vaKGJH7aA/square140.png")
    }

    var closingDate: NSDate {
        return sale.endDate
    }

    var numberOfLots: Int {
        return saleArtworks.count
    }

    // TODO: Temporary, shouldn't be exposing raw models 😬
    var artworks: [Artwork] {
        return saleArtworks.map { saleArtwork in
            return saleArtwork.artwork
        }
    }
}
