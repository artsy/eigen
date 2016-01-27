struct AuctionRefineSettings: Equatable {
    let ordering: AuctionOrderingSwitchValue
    let range: (min: Int, max: Int)

    // TODO: This is a temporary initializer until we have price range finished.
    init(ordering: AuctionOrderingSwitchValue) {
        self.ordering = ordering
        self.range = (min: 0, max: 100)
    }
}

func ==(lhs: AuctionRefineSettings, rhs: AuctionRefineSettings) -> Bool {
    guard lhs.ordering == rhs.ordering else { return false }
    guard lhs.range.min == rhs.range.min else { return false }
    guard lhs.range.max == rhs.range.max else { return false }
    return true
}
