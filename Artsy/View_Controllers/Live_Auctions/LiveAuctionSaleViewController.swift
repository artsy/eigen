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
        salesPerson.saleOnHoldSignal.subscribe { [weak self] (onHold) in
            guard let `self` = self else { return }
            let message: String?
            if onHold {
                message = (self.traitCollection.horizontalSizeClass == .compact) ?
                    "The auction is currently on hold.\nYou can still place max bids." :
                    "The auction is currently on hold. You can still place max bids."
            } else {
                message = nil
            }
            
            self.lotSetController?.setSaleStatus(message: message)
        }
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

        // Dismiss any popovers.
        if #available(iOS 10, *) {
            // This crashes on iOS 10, but the bug we're working around is resolved so do nothing.
        } else {
            guard let internalPopover = value(forKey: "_hidden" + "PopoverController") as? UIPopoverController else { return }
            internalPopover.dismiss(animated: false)
        }
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
//    func DELETEMEsetSaleStatusMessage(_ message: String?) {
//        guard let unwrappedMessage = message else {
//            saleStatusView?.removeFromSuperview()
//            saleStatusView = nil
//            return
//        }
//
//        let newSaleStatusView = UIView()
//        newSaleStatusView.backgroundColor = .red
//        self.view.addSubview(newSaleStatusView)
//        newSaleStatusView.constrainWidth(toView: self.view, predicate: "0")
//        newSaleStatusView.constrainHeight("20")
//        newSaleStatusView.alignTopEdge(withView: self.view, predicate: "0")
//
//        self.saleStatusView = newSaleStatusView
//
////        if let unwrappedMessage = message {
////
////        } else {
////
////        }
////
////        if message != nil {
////            let unwrappedMessage = message!
////        } else {
////
////        }
//    }
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
