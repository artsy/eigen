import UIKit
import Then

/// A class to display a fetched and fully-populated LiveSaleViewModel. Hosted by LiveAuctionViewController, which does the fetching.
class LiveAuctionSaleViewController: UISplitViewController {
    let sale: LiveSale
    let salesPerson: LiveAuctionsSalesPersonType
    let useCompactLayout: Bool
    let suppressJumpingToOpenLots: Bool

    var lotSetController: LiveAuctionLotSetViewController?
    var lotsSetNavigationController: ARSerifNavigationViewController?
    var lotListController: LiveAuctionLotListViewController?

    init(sale: LiveSale, salesPerson: LiveAuctionsSalesPersonType, useCompactLayout: Bool, suppressJumpingToOpenLots: Bool) {
        self.sale = sale
        self.salesPerson = salesPerson
        self.useCompactLayout = useCompactLayout
        self.suppressJumpingToOpenLots = suppressJumpingToOpenLots

        super.init(nibName: nil, bundle: nil)

        setup()
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Split-view specific setup.
        preferredDisplayMode = .allVisible
        preferredPrimaryColumnWidthFraction = 0.4
        delegate = self
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        // Hrm, yes, so this seems to be a weird side effect of UISplitVC
        // in that it won't pass the view transition funcs down to it's children
        viewControllers.forEach { vc in
            vc.beginAppearanceTransition(false, animated: animated)
        }

        self.ar_dismissPopovers()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)

        // See comment in viewWillDisappear(_:) for explanation
        viewControllers.forEach { vc in
            vc.endAppearanceTransition()
        }
    }
}

private typealias PrivateFunctions = LiveAuctionSaleViewController
extension PrivateFunctions {
    func setup() {
        let lotSetController = LiveAuctionLotSetViewController(salesPerson: salesPerson, useCompactLayout: useCompactLayout).then {
            $0.suppressJumpingToOpenLots = suppressJumpingToOpenLots
        }
        self.lotSetController = lotSetController

        let lotsSetNavigationController = ARSerifNavigationViewController(rootViewController: lotSetController)
        self.lotsSetNavigationController = lotsSetNavigationController

        if useCompactLayout {
            viewControllers = [lotsSetNavigationController]
        } else {
            let lotListController = LiveAuctionLotListViewController(salesPerson: salesPerson, currentLotSignal: salesPerson.currentLotSignal, auctionViewModel: salesPerson.auctionViewModel).then {
                $0.delegate = self
            }
            self.lotListController = lotListController

            let lotListNav = ARSerifNavigationViewController(rootViewController: lotListController)

            viewControllers = [lotListNav, lotsSetNavigationController]
        }
    }
}

extension LiveAuctionSaleViewController: UISplitViewControllerDelegate {
    func splitViewController(_ splitViewController: UISplitViewController, collapseSecondary secondaryViewController: UIViewController, onto primaryViewController: UIViewController) -> Bool {
        return true
    }
}

extension LiveAuctionSaleViewController: LiveAuctionLotListViewControllerDelegate {
    func didSelectLotAtIndex(_ index: Int, forLotListViewController lotListViewController: LiveAuctionLotListViewController) {
        lotSetController?.jumpToLotAtIndex(index)
    }
}
