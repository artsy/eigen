struct AuctionRefineSettings {

    let ordering: AuctionOrderingSwitchValue
    var priceRange: PriceRange?
    var saleViewModel: SaleViewModel

    func saleID() -> NSString {
        return saleViewModel.saleID
    }
}

extension AuctionRefineSettings: RefinableType {

    var numberOfSections: Int {
        return 1
    }

    func titleOfSection(section: Int) -> String {
        return "Sort"
    }

    func numberOfRowsInSection(section: Int) -> Int {
        return AuctionOrderingSwitchValue.allSwitchValuesWithViewModel(saleViewModel).count
    }

    func titleForRowAtIndexPath(indexPath: NSIndexPath) -> String {
        return AuctionOrderingSwitchValue.allSwitchValuesWithViewModel(saleViewModel)[indexPath.row].rawValue
    }

    func allowMultipleSelectionInSection(section: Int) -> Bool {
        return false
    }

    func shouldCheckRowAtIndexPath(indexPath: NSIndexPath) -> Bool {
        return ordering == AuctionOrderingSwitchValue.fromIntWithViewModel(indexPath.row, saleViewModel: saleViewModel)
    }

    func selectedRowsInSection(section: Int) -> [NSIndexPath] {
        guard let indexPath = indexPathOfSelectedOrdering() else { return [] }
        return [indexPath]
    }

    var priceRangePrompt: String? {
        return nil
    }

    func refineSettingsWithPriceRange(range: PriceRange) -> AuctionRefineSettings {
        return AuctionRefineSettings(ordering: self.ordering, priceRange: range, saleViewModel: saleViewModel)
    }

    func refineSettingsWithSelectedIndexPath(indexPath: NSIndexPath) -> AuctionRefineSettings {
        let ordering = AuctionOrderingSwitchValue.fromIntWithViewModel(indexPath.row, saleViewModel: saleViewModel)
        return AuctionRefineSettings(ordering: ordering, priceRange: priceRange, saleViewModel: saleViewModel)
    }

    func indexPathOfSelectedOrdering() -> NSIndexPath? {
        if let i = AuctionOrderingSwitchValue.allSwitchValuesWithViewModel(saleViewModel).indexOf(ordering) {
            return NSIndexPath.init(forItem: i, inSection: 0)
        }
        return nil
    }
}

extension AuctionRefineSettings: Equatable {}

func == (lhs: AuctionRefineSettings, rhs: AuctionRefineSettings) -> Bool {
    guard lhs.ordering == rhs.ordering else { return false }

    if let lhsRange = lhs.priceRange, rhsRange = rhs.priceRange {
        guard lhsRange.min == rhsRange.min else { return false }
        guard lhsRange.max == rhsRange.max else { return false }
    }
    return true
}
