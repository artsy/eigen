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

    func titleOfSection(_ section: Int) -> String {
        return "Sort"
    }

    func numberOfRowsInSection(_ section: Int) -> Int {
        return AuctionOrderingSwitchValue.allSwitchValuesWithViewModel(saleViewModel).count
    }

    func titleForRowAtIndexPath(_ indexPath: IndexPath) -> String {
        return AuctionOrderingSwitchValue.allSwitchValuesWithViewModel(saleViewModel)[indexPath.row].rawValue
    }

    func allowMultipleSelectionInSection(_ section: Int) -> Bool {
        return false
    }

    func shouldCheckRowAtIndexPath(_ indexPath: IndexPath) -> Bool {
        return ordering == AuctionOrderingSwitchValue.fromIntWithViewModel(indexPath.row, saleViewModel: saleViewModel)
    }

    func selectedRowsInSection(_ section: Int) -> [IndexPath] {
        guard let indexPath = indexPathOfSelectedOrdering() else { return [] }
        return [indexPath]
    }

    var priceRangePrompt: String? {
        return nil
    }

    func refineSettingsWithPriceRange(_ range: PriceRange) -> AuctionRefineSettings {
        return AuctionRefineSettings(ordering: self.ordering, priceRange: range, saleViewModel: saleViewModel)
    }

    func refineSettingsWithSelectedIndexPath(_ indexPath: IndexPath) -> AuctionRefineSettings {
        let ordering = AuctionOrderingSwitchValue.fromIntWithViewModel(indexPath.row, saleViewModel: saleViewModel)
        return AuctionRefineSettings(ordering: ordering, priceRange: priceRange, saleViewModel: saleViewModel)
    }

    func indexPathOfSelectedOrdering() -> IndexPath? {
        if let i = AuctionOrderingSwitchValue.allSwitchValuesWithViewModel(saleViewModel).index(of: ordering) {
            return IndexPath.init(item: i, section: 0)
        }
        return nil
    }
}

extension AuctionRefineSettings: Equatable {}

func == (lhs: AuctionRefineSettings, rhs: AuctionRefineSettings) -> Bool {
    guard lhs.ordering == rhs.ordering else { return false }

    if let lhsRange = lhs.priceRange, let rhsRange = rhs.priceRange {
        guard lhsRange.min == rhsRange.min else { return false }
        guard lhsRange.max == rhsRange.max else { return false }
    }
    return true
}
