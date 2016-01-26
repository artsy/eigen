struct AuctionRefineSettings {
    let ordering: AuctionOrderingSwitchValue
    let range: (min: Int, max: Int)
}

extension AuctionRefineSettings {
    func settingsWithOrdering(ordering: AuctionOrderingSwitchValue) -> AuctionRefineSettings {
        return AuctionRefineSettings(ordering: ordering, range: self.range)
    }
}

extension AuctionRefineSettings: Equatable {}

func ==(lhs: AuctionRefineSettings, rhs: AuctionRefineSettings) -> Bool {
    guard lhs.ordering == rhs.ordering else { return false }
    guard lhs.range.min == rhs.range.min else { return false }
    guard lhs.range.max == rhs.range.max else { return false }
    return true
}
