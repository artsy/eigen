import UIKit
import MessageUI
import ORStackView
import Interstellar
import ARAnalytics

typealias MarkdownString = String

struct AuctionInformation {
    struct FAQEntry {
        let name: String
        let slug: String

        let markdownSignal = Observable<MarkdownString>()
        func downloadContent() {
            ArtsyAPI.getPageContent(forSlug: slug) {
                self.markdownSignal.update($0)
            }
        }
    }
}

class AuctionInformationViewController: UIViewController {
    weak var titleViewDelegate: AuctionTitleViewDelegate?
    var saleViewModel: SaleViewModel

    let FAQEntries: [AuctionInformation.FAQEntry]

    var scrollView: ORStackScrollView

    init(saleViewModel: SaleViewModel) {
        self.scrollView = ORStackScrollView()
        self.saleViewModel = saleViewModel

        self.FAQEntries = [
            AuctionInformation.FAQEntry(name: "Bidding", slug:"how-auctions-work-bidding"),
            AuctionInformation.FAQEntry(name: "Buyer’s Premium, Taxes & Fees", slug: "how-auctions-work-buyers-premium-taxes-and-fees"),
            AuctionInformation.FAQEntry(name: "Payments and Shipping", slug: "how-auctions-work-payments-and-shipping"),
            AuctionInformation.FAQEntry(name: "Emails and Alerts", slug: "how-auctions-work-emails-and-alerts"),
            AuctionInformation.FAQEntry(name: "Conditions of Sale", slug: "how-auctions-work-conditions-of-sale")
        ]

        super.init(nibName: nil, bundle: nil)
        self.title = "Auction Information"
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if navigationController?.topViewController == self {
          ARAnalytics.pageView("Sale Information", withProperties: [
              "auction_slug": saleViewModel.saleID,
              "slug": NSString(format: "/auction/%@/info", saleViewModel.saleID)
          ])
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = UIColor.white
        view.addSubview(scrollView)

        scrollView.constrainTopSpace(toView: flk_topLayoutGuide(), predicate: "0")
        scrollView.alignLeading("0", trailing: "0", toView: view)
        scrollView.constrainBottomSpace(toView: flk_bottomLayoutGuide(), predicate: "0")

        let stackView = scrollView.stackView

        if let thumbnail = saleViewModel.profileImageURL {
            let partnerNameThumbnail = UIImageView()
            stackView?.addSubview(partnerNameThumbnail, withTopMargin: "20")
            partnerNameThumbnail.ar_setImage(with: thumbnail as URL!)
            partnerNameThumbnail.alignLeadingEdge(withView: view, predicate: "20")
            partnerNameThumbnail.constrainWidth("50")
            partnerNameThumbnail.constrainHeight("50")
        }

        let auctionTitleView = AuctionTitleView(viewModel: saleViewModel, delegate: titleViewDelegate, fullWidth: true, showAdditionalInformation: false)
        stackView?.addSubview(auctionTitleView, withTopMargin: "20", sideMargin: "40")

        let auctionDescriptionView = ARTextView()
        auctionDescriptionView.useSemiBold = true
        auctionDescriptionView.setMarkdownString(saleViewModel.saleDescription)
        auctionDescriptionView.viewControllerDelegate = self
        stackView?.addSubview(auctionDescriptionView, withTopMargin: "10", sideMargin: "40")

        let auctionBeginsHeaderLabel = UILabel()
        auctionBeginsHeaderLabel.font = UIFont.sansSerifFont(withSize: 12)
        auctionBeginsHeaderLabel.text = "AUCTION BEGINS"
        stackView?.addSubview(auctionBeginsHeaderLabel, withTopMargin: "0", sideMargin: "40")

        let auctionBeginsLabel = UILabel()
        auctionBeginsLabel.font = UIFont.serifFont(withSize: 16)

        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .long
        auctionBeginsLabel.text = formatter.string(from: saleViewModel.startDate as Date)
        stackView?.addSubview(auctionBeginsLabel, withTopMargin: "10", sideMargin: "40")

        if let liveAuctionStartDate = saleViewModel.liveAuctionStartDate {
            auctionBeginsHeaderLabel.text = "LIVE BIDDING BEGINS"
            auctionBeginsLabel.text = formatter.string(from: liveAuctionStartDate as Date)
        } else {
            auctionBeginsHeaderLabel.text = "AUCTION BEGINS"
            auctionBeginsLabel.text = formatter.string(from: saleViewModel.startDate)
        }

        let faqButtonDescription = NavigationButton(
            buttonClass: ARNavigationButton.self,
            properties: ["title": "AUCTIONS FAQ"],
            handler: { [unowned self] _ in self.showFAQ(true)  }
        )

        let contactButtonDescription = NavigationButton(
            buttonClass: ARNavigationButton.self,
            properties: ["title": "CONTACT"],
            handler: { [unowned self] _ in self.showContact(true)  }
        )

        let buyersPremiumButtonDescription = NavigationButton(
            buttonClass: ARNavigationButton.self,
            properties: ["title": "BUYER'S PREMIUM INFO"],
            handler: { [unowned self] _ in self.showBuyersPremium(true)  }
        )

        let buttons = saleViewModel.hasBuyersPremium ?
            [buyersPremiumButtonDescription, faqButtonDescription, contactButtonDescription] :
            [faqButtonDescription, contactButtonDescription]

        let buttonsViewController = ARNavigationButtonsViewController.viewController(withButtons: buttons )

        stackView?.add(buttonsViewController, toParent: self, withTopMargin: "20", sideMargin: "40")
    }

    @discardableResult
    func showFAQ(_ animated: Bool) -> FAQViewController {
        let controller = FAQViewController(entries: FAQEntries)
        navigationController?.pushViewController(controller, animated: animated)
        return controller
    }

    func showContact(_ animated: Bool) {
        ARAnalytics.event(ARAnalyticsAuctionContactTapped, withProperties: [
            "auction_slug": saleViewModel.saleID,
            "auction_state": saleViewModel.saleAvailabilityString,
            "context_type": navigationController?.topViewController == self ? "sale" : "sale information"
        ])

        if MFMailComposeViewController.canSendMail() {
            let controller = MFMailComposeViewController()
            controller.mailComposeDelegate = self
            controller.setToRecipients(["inquiries@artsy.net"])
            controller.setSubject("Questions about “\(saleViewModel.displayName)”")
            self.present(controller, animated: animated, completion: nil)
        } else {
            let alert = UIAlertController(title: "No email set up on your device", message: "You can email inquiries@artsy.net to get answers to your questions", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Back", style: .default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
    }

    func showBuyersPremium(_ animated: Bool) {
        let saleID = saleViewModel.saleID
        ARAnalytics.event(ARAnalyticsAuctionContactTapped, withProperties: [
            "auction_slug": saleID,
            "auction_state": saleViewModel.saleAvailabilityString,
            "context_type": navigationController?.topViewController == self ? "sale" : "sale information"
            ])

        let controller = ARSwitchBoard.sharedInstance().loadPath("/auction/\(saleID)/buyers-premium")
        controller.title = "Buyer's Premium"
        navigationController?.pushViewController(controller, animated: animated)
    }
}

private typealias UIActivitySetup = AuctionInformationViewController
extension UIActivitySetup {
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        saleViewModel.registerSaleAsActiveActivity(self)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        userActivity?.invalidate()
    }
}


private typealias MailCompositionCallbacks = AuctionInformationViewController
extension MailCompositionCallbacks: MFMailComposeViewControllerDelegate {
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        self.dismiss(animated: true, completion: nil)
    }
}

extension AuctionInformationViewController: ARTextViewDelegate {
    func textView(_ textView: ARTextView!, shouldOpen viewController: UIViewController!) {
        self.dismiss(animated: true, completion: {
            ARTopMenuViewController.shared().push(viewController)
        })
    }
}

extension AuctionInformationViewController {
    class FAQViewController: UIViewController, ARTextViewDelegate {
        var entries: [AuctionInformation.FAQEntry]
        var stackView: ORStackView
        var currentlyExpandedEntryView: EntryView?

        var entryViews: [EntryView] {
            return self.stackView.subviews.flatMap { $0 as? EntryView }
        }

        required init(entries: [AuctionInformation.FAQEntry]) {
            self.entries = entries
            self.stackView = ORStackView()
            super.init(nibName: nil, bundle: nil)
            self.title = "Auction FAQ"
        }

        required init?(coder aDecoder: NSCoder) {
            fatalError()
        }

        override func viewDidLoad() {
            super.viewDidLoad()

            self.view.backgroundColor = UIColor.white
            self.view.addSubview(self.stackView)

            self.stackView.constrainTopSpace(toView: self.flk_topLayoutGuide(), predicate: "0")
            self.stackView.alignLeading("0", trailing: "0", toView: self.view)
            self.stackView.constrainBottomSpace(toView: self.flk_bottomLayoutGuide(), predicate: "-40")

            for (index, entry) in self.entries.enumerated() {
                let entryView = EntryView(entry: entry, textDelegate: self) { [unowned self] in self.expandView($0) }
                entryView.tag = index
                self.stackView.addSubview(entryView, withTopMargin: "0", sideMargin: "0")
            }

            self.currentlyExpandedEntryView = self.entryViews.first
            self.currentlyExpandedEntryView?.expand()
        }

        func textView(_ textView: ARTextView!, shouldOpen viewController: UIViewController!) {
            self.navigationController?.pushViewController(viewController, animated: true)
        }

        func expandView(_ viewToExpand: EntryView) {
            if self.currentlyExpandedEntryView != viewToExpand {
                let previouslyExpandedEntryView = self.currentlyExpandedEntryView
                self.currentlyExpandedEntryView = viewToExpand

                UIView.animateIf(ARPerformWorkAsynchronously.boolValue, duration: 0.25, { 
                    // Do it in this order, otherwise we’d get unsatisfiable constraints.
                    self.currentlyExpandedEntryView?.expand()
                    previouslyExpandedEntryView?.collapse()
                    self.stackView.layoutIfNeeded()
                }, completion: nil)
            }
        }
    }

    class EntryView: UIView {
        var tapHandler: (EntryView) -> Void
        var contentHeightConstraint: NSLayoutConstraint
        var tapDirection: UIImageView

        required init(entry: AuctionInformation.FAQEntry, textDelegate: ARTextViewDelegate, tapHandler: @escaping (EntryView) -> Void) {
            self.tapHandler = tapHandler

            let topBorder = UIView()
            topBorder.backgroundColor = .artsyGrayRegular()

            let titleButton = UIButton(type: .custom)

            let titleLabel = UILabel()
            titleLabel.text = entry.name.uppercased()
            titleLabel.numberOfLines = 1
            titleLabel.backgroundColor = UIColor.clear
            titleLabel.font = UIFont.sansSerifFont(withSize: 12)

            let arrowIndicator = UIImageView(image: UIImage(named:"navigation_more_arrow_vertical"))
            self.tapDirection = arrowIndicator

            let contentView = ARTextView()
            contentView.isScrollEnabled = true
            contentView.useSemiBold = true

            entry.downloadContent()
            entry.markdownSignal.subscribe { string in
                /// The API comes with headers we should remove
                let content = string.stringByRemovingLinesMatching { $0.hasPrefix("# ") }
                contentView.setMarkdownString(content)
            }

            contentView.viewControllerDelegate = textDelegate

            self.contentHeightConstraint = contentView.constrainHeight("0")

            super.init(frame: CGRect.zero)

            titleButton.addTarget(self, action: #selector(EntryView.didTap), for: .touchUpInside)

            addSubview(topBorder)
            addSubview(titleButton)
            titleButton.addSubview(titleLabel)
            titleButton.addSubview(arrowIndicator)
            addSubview(contentView)

            topBorder.constrainHeight("1")
            topBorder.alignTopEdge(withView: self, predicate: "0")
            topBorder.alignLeading("0", trailing: "0", toView: self)

            titleLabel.alignTop("0", bottom: "0", toView: titleButton)
            titleLabel.alignLeading("20", trailing: "-20", toView: titleButton)

            titleButton.constrainHeight("50")
            titleButton.constrainTopSpace(toView: topBorder, predicate: "0")
            titleButton.alignLeading("0", trailing: "0", toView: self)

            arrowIndicator.alignTrailingEdge(withView: titleButton, predicate: "-20")
            arrowIndicator.constrainTopSpace(toView: topBorder, predicate: "22")

            contentView.constrainTopSpace(toView: titleButton, predicate: "0")
            // Inset the text with text container insets, instead of leading/traling constraints, so that the
            // text view’s scroll bar is all the way the side of the entry view.
            contentView.textContainerInset = UIEdgeInsets(top: 0, left: 20, bottom: 0, right: 20)
            contentView.alignLeading("0", trailing: "0", toView: self)

            self.alignBottomEdge(withView: contentView, predicate: "0")
        }

        required init?(coder aDecoder: NSCoder) {
            fatalError()
        }

        func expand() {
            contentHeightConstraint.isActive = false
            tapDirection.transform = CGAffineTransform(rotationAngle: CGFloat(M_PI))
        }

        func collapse() {
            contentHeightConstraint.isActive = true
            tapDirection.transform = CGAffineTransform.identity
        }

        func didTap() {
            tapHandler(self)
        }
    }
}

extension String {
    func stringByRemovingLinesMatching(_ matcher: (String) -> (Bool)) -> String {
        let lines = self.components(separatedBy: "\n")
        return lines.filter { matcher($0) == false }.joined(separator: "\n")
    }
}
