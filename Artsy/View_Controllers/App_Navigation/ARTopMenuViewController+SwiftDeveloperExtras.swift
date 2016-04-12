import UIKit


extension ARTopMenuViewController {

    func runSwiftDeveloperExtras() {
        self.pushViewController(ARSwitchBoard.sharedInstance().loadAuctionWithID("waddingtons-dot-ca-highlights-from-concrete-contemporary-auctions-and-projects"))
    }
}