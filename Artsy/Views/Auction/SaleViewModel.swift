import Foundation

class SaleViewModel {
    private let sale: Sale

    init(sale: Sale) {
        self.sale = sale
    }
}

extension SaleViewModel {
    var backgroundImageURL: NSURL! {
        return NSURL(string: "https://d32dm0rphc51dk.cloudfront.net/BLv_dHIIVvShtDB8GCxFdg/large_rectangle.jpg")!
    }
}
