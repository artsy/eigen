typealias PriceRange = (min: Int, max: Int)

protocol RefinableType: Equatable {

    // table view
    var numberOfSections: Int { get }
    func titleOfSection(_ section: Int) -> String
    func numberOfRowsInSection(_ section: Int) -> Int
    func titleForRowAtIndexPath(_ indexPath: IndexPath) -> String

    // selection
    func allowMultipleSelectionInSection(_ section: Int) -> Bool
    func shouldCheckRowAtIndexPath(_ indexPath: IndexPath) -> Bool
    func selectedRowsInSection(_ section: Int) -> [IndexPath]

    // price slider
    var priceRange: PriceRange? { get }
    var priceRangePrompt: String? { get }

    // new settings
    func refineSettingsWithSelectedIndexPath(_ indexPath: IndexPath) -> Self
    func refineSettingsWithPriceRange(_ range: PriceRange) -> Self

    var hasEstimates: Bool { get }
}

extension RefinableType {
    var hasEstimates: Bool {
        guard let priceRange = priceRange else { return false }
        return priceRange != (0, 0)
    }
}
