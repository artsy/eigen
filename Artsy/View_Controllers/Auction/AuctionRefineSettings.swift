struct AuctionRefineSettings {
    typealias Range = (min: Int, max: Int)

    let ordering: AuctionOrderingSwitchValue
    let range: Range

    var hasEstimates: Bool {
        return range.min != 0 && range.max != 0
    }
}

extension AuctionRefineSettings {
    func settingsWithOrdering(ordering: AuctionOrderingSwitchValue) -> AuctionRefineSettings {
        return AuctionRefineSettings(ordering: ordering, range: self.range)
    }

    func settingsWithRange(range: Range) -> AuctionRefineSettings {
        return AuctionRefineSettings(ordering: self.ordering, range: range)
    }
}

extension AuctionRefineSettings: Equatable {}

func ==(lhs: AuctionRefineSettings, rhs: AuctionRefineSettings) -> Bool {
    guard lhs.ordering == rhs.ordering else { return false }
    guard lhs.range.min == rhs.range.min else { return false }
    guard lhs.range.max == rhs.range.max else { return false }
    return true
}
