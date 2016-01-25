struct AuctionRefineSettings: Equatable {
    let ordering: AuctionOrderingSwitchValue
    // TODO: price range
}

func ==(lhs: AuctionRefineSettings, rhs: AuctionRefineSettings) -> Bool {
    guard lhs.ordering == rhs.ordering else { return false }
    return true
}
