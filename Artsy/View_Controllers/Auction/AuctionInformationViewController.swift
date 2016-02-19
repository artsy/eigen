import UIKit
import MessageUI
import ORStackView

typealias MarkdownString = String

struct AuctionInformation {
    let partnerName: String
    let title: String
    let description: MarkdownString
    let startsAt: String
    let contact: MarkdownString
    let FAQEntries: [FAQEntry]
    
    struct FAQEntry {
        let name: String
        let content: MarkdownString
    }
}

class AuctionInformationViewController : UIViewController {
    var auctionInformation: AuctionInformation
    var titleViewDelegate: AuctionTitleViewDelegate?
    var saleViewModel: SaleViewModel

    var scrollView: ORStackScrollView

    init(auctionInformation: AuctionInformation, saleViewModel: SaleViewModel) {
        self.auctionInformation = auctionInformation
        self.scrollView = ORStackScrollView()
        self.saleViewModel = saleViewModel;
        super.init(nibName: nil, bundle: nil)
        self.title = "Auction Information"
    }

//
//    override convenience init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: NSBundle?) {
//        let FAQEntries = [
//            AuctionInformation.FAQEntry(name: "Bidding", content: "# BIDDING\n\n## How do I Register for an Auction?\n\nAll bidders need to register by completing an online form and providing all required information, such as their full name, contact information, and credit card details. Sometimes additional information may be required, and we’ll notify you of additional requirements when they apply.\n\n## How do I place a bid?\n\nBidding on Artsy is easy with our automatic bidding system. Enter any bid amount as long as it is greater than or equal to the next minimum bid shown on the bidding screen, then click the “Bid” button. This will automatically place a bid for you at the next increment and save the amount you entered (if higher) as your “Maximum Bid.” \n\n## What is a Maximum Bid?\n\nIf you enter a bid amount higher than the next minimum bid, the amount you enter is treated as your “Maximum Bid.” Entering a Maximum Bid does not necessarily mean you will pay that price, and you may pay less. As the auction progresses, our system will bid automatically for you against other bidders, according to our automatic bidding increments (see below), up to (but not exceeding) your Maximum Bid, only as much as necessary to maintain your position as highest bidder.  If two bidders attempt to enter the same Maximum Bid, the first bidder to enter that amount will be the winner. \n\n## What are Bidding Increments?\n\nOur automatic bidding increments determine the next minimum bid that can be placed. They are based on the current bid of each item and increase at the following intervals, when the current bid is:\n\nUnder $1,000:  $50  \n$1,000 - $1,999: $100  \n$2,000 - $4,999: $250  \n$5,000 - $9,999: $500  \n$10,000 - $19,999: $1,000  \n$20,000 - $49,999: $2,000   \n$50,000 - $99,999: $5,000  \nAt or above $100,000: $10,000\n\nNote: Our usual bidding increments are listed above, but from time to time we may increase, decrease, add or remove increments in order to help test new bidding features, optimize the bidding experience or for other purposes. This may occur before, during or after any auction. \n\n## What is a Reserve Price?\n\nA reserve price (also known as a \"reserve\") is the confidential minimum price below which the item may not be sold in the auction. If an item has a reserve, this will be indicated on the bidding screen where you enter your bid. When you bid on an item with a reserve, if your Maximum Bid meets or exceeds the reserve, your bid will be increased to meet the reserve (according to our automatic bidding increments), and bidding will continue from there. If an item is offered with a reserve, Artsy will be authorized to bid on the seller's behalf, up to the amount of the reserve."),
//            AuctionInformation.FAQEntry(name: "Buyer’s Premium, Taxes & Fees", content: "# BUYER'S PREMIUM, TAXES & FEES\n\n## What is a buyer’s premium?\nA buyer’s premium is an additional charge the winning bidder pays on top of the item's hammer price. If an item has a buyer's premium, this will be indicated on the bidding screen where you enter your bid, along with the rate of the buyer's premium. The buyer's premium is calculated as a percentage of the item's hammer price.\n\n## What about taxes?\nBuyers are responsible for paying all sales and use taxes, VAT and any other taxes that apply to their purchases. Applicable taxes will be added to the winning bidder’s invoice after the auction. \n"),
//            AuctionInformation.FAQEntry(name: "Payments and Shipping", content: "# PAYMENTS AND SHIPPING\n\n## How does payment work after an auction?\nWinning bidders will receive an email after the auction with instructions for how to checkout and pay for purchased items. Depending on the sale, either Artsy or the seller will collect payment from the buyer, and buyers will be notified accordingly upon conclusion of the auction.\n\n## How does shipping work?\nAfter an auction, the buyer will be connected with the seller to arrange shipping. Normally buyers may choose between a common carrier (like FedEx) and a specialist fine art shipper. Shipping costs are the responsibility of the buyer.\n"),
//            AuctionInformation.FAQEntry(name: "Emails and Alerts", content: "# EMAILS AND ALERTS\n\nBidders will receive an email to confirm when their bid has been received, and an email to notify them when they are outbid. After the auction, winning bidders will also receive an email to notify them of their winning bid. Please be sure to register with a valid email address and to check your email frequently during an auction to make sure you receive all relevant updates.  "),
//            AuctionInformation.FAQEntry(name: "Conditions of Sale", content: "# CONDITIONS OF SALE\n\nOur standard [Conditions of Sale](/conditions-of-sale) contain important terms, conditions and information that apply to all bidders. By bidding in an auction on Artsy, you are accepting our [Conditions of Sale](/conditions-of-sale). Please read them carefully before bidding. \n")
//        ]
//        
//        let auctionInformation = AuctionInformation(partnerName: "Sotheby’s", title: "Sotheby’s Boundless Contemporary", description: "On Thursday, November 12, Swiss Institute will host their Annual Benefit Dinner & Auction–the most important fundraising event of the year–with proceeds going directly towards supporting their innovative exhibitions and programs. Since 1986, Swiss Institute has been dedicated to promoting forward-thinking and experimental art.", startsAt: "January 26 6:00PM EST", contact: "TODO Markdown?", FAQEntries: FAQEntries)
//        
//        self.init(auctionInformation: auctionInformation, saleViewModel )
//    }

    required init?(coder aDecoder: NSCoder) {
        fatalError()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
    
        view.backgroundColor = UIColor.whiteColor()
        view.addSubview(scrollView)
        
        scrollView.constrainTopSpaceToView(flk_topLayoutGuide(), predicate: "0")
        scrollView.alignLeading("0", trailing: "0", toView: view)
        scrollView.constrainBottomSpaceToView(flk_bottomLayoutGuide(), predicate: "0")
        
        let stackView = scrollView.stackView

        let partnerNameThumbnail = UIImageView()
        stackView.addSubview(partnerNameThumbnail, withTopMargin: "20")
        partnerNameThumbnail.constrainLeadingSpaceToView(view, predicate: "20")
        partnerNameThumbnail.constrainWidth("50")
        
        let auctionTitleView = AuctionTitleView(viewModel: saleViewModel, registrationStatus: nil, delegate: titleViewDelegate, fullWidth: true, showAdditionalInformation: false)
        stackView.addSubview(auctionTitleView, withTopMargin: "20", sideMargin: "40")
        
        let auctionDescriptionView = ARTextView()
        auctionDescriptionView.setMarkdownString(saleViewModel.saleDescription)
        stackView.addSubview(auctionDescriptionView, withTopMargin: "10", sideMargin: "40")
        
        let auctionBeginsHeaderLabel = UILabel()
        auctionBeginsHeaderLabel.font = UIFont.sansSerifFontWithSize(12)
        auctionBeginsHeaderLabel.text = "AUCTION BEGINS"
        stackView.addSubview(auctionBeginsHeaderLabel, withTopMargin: "20", sideMargin: "40")
        
        let auctionBeginsLabel = UILabel()
        auctionBeginsLabel.font = UIFont.serifFontWithSize(16)
        let formatter = NSDateFormatter()
        formatter.dateStyle = .MediumStyle
        formatter.timeStyle = .LongStyle
        auctionBeginsLabel.text = formatter.stringFromDate(saleViewModel.startDate)
        stackView.addSubview(auctionBeginsLabel, withTopMargin: "10", sideMargin: "40")
        
        let faqButtonDescription = [ARNavigationButtonClassKey: ARNavigationButton.self,
                                    ARNavigationButtonPropertiesKey: ["title": "AUCTIONS FAQ"],
                                    ARNavigationButtonHandlerKey: toBlock({ [unowned self] (_) in self.showFAQ(true) })]
        let contactButtonDescription = [ARNavigationButtonClassKey: ARNavigationButton.self,
                                        ARNavigationButtonPropertiesKey: ["title": "CONTACT"],
                                        ARNavigationButtonHandlerKey: toBlock({ [unowned self] (_) in self.showContact(true) })]
        let buttonsViewController = ARNavigationButtonsViewController(buttonDescriptions: [faqButtonDescription, contactButtonDescription])

        stackView.addViewController(buttonsViewController, toParent: self, withTopMargin: "20", sideMargin: "40")
    }
    
    func showFAQ(animated: Bool) -> FAQViewController {
        let controller = FAQViewController(entries: self.auctionInformation.FAQEntries)
        navigationController?.pushViewController(controller, animated: animated)
        return controller
    }

    func showContact(animated: Bool) {
        if (MFMailComposeViewController.canSendMail()) {
            let controller = MFMailComposeViewController()
            controller.mailComposeDelegate = self
            controller.setToRecipients(["inquiries@artsy.net"])
            controller.setSubject("Questions about “\(self.auctionInformation.title)”")
            self.presentViewController(controller, animated: animated, completion: nil)
        }
    }

    private func toBlock(closure: @convention (block) UIButton -> Void) -> AnyObject {
        return unsafeBitCast(closure, AnyObject.self)
    }
}

private typealias MailCompositionCallbacks = AuctionInformationViewController
extension MailCompositionCallbacks: MFMailComposeViewControllerDelegate {
    func mailComposeController(controller: MFMailComposeViewController, didFinishWithResult result: MFMailComposeResult, error: NSError?) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }
}

extension AuctionInformationViewController {
    class FAQViewController : UIViewController, ARTextViewDelegate {
        var entries: [AuctionInformation.FAQEntry]
        var stackView: ORStackView
        var currentlyExpandedEntryView: EntryView?
        
        var entryViews: [EntryView] {
            return self.stackView.subviews as! [EntryView]
        }
        
        required init(entries: [AuctionInformation.FAQEntry]) {
            self.entries = entries;
            self.stackView = ORStackView()
            super.init(nibName: nil, bundle: nil)
            self.title = "Auction FAQ"
        }
        
        required init?(coder aDecoder: NSCoder) {
            fatalError()
        }
        
        override func viewDidLoad() {
            super.viewDidLoad()
            
            self.view.backgroundColor = UIColor.whiteColor()
            self.view.addSubview(self.stackView)
            
            self.stackView.constrainTopSpaceToView(self.flk_topLayoutGuide(), predicate: "0")
            self.stackView.alignLeading("0", trailing: "0", toView: self.view)
            self.stackView.constrainBottomSpaceToView(self.flk_bottomLayoutGuide(), predicate: "-40")
            
            for (var i = 0; i < self.entries.count; i++) {
                let entry = self.entries[i]
                let entryView = EntryView(entry: entry, textDelegate: self) { [unowned self] in self.expandView($0) }
                entryView.tag = i
                self.stackView.addSubview(entryView, withTopMargin: "0", sideMargin: "0")
            }
            
            self.currentlyExpandedEntryView = self.entryViews.first
            self.currentlyExpandedEntryView!.expand()
        }

        func textView(textView: ARTextView!, shouldOpenViewController viewController: UIViewController!) {
            self.navigationController?.pushViewController(viewController, animated: true)
        }
        
        func expandView(viewToExpand: EntryView) {
            if (self.currentlyExpandedEntryView != viewToExpand) {
                let previouslyExpandedEntryView = self.currentlyExpandedEntryView
                self.currentlyExpandedEntryView = viewToExpand
                
                UIView.animateWithDuration(0.25, animations: {
                    // Do it in this order, otherwise we’d get unsatisfiable constraints.
                    self.currentlyExpandedEntryView!.expand()
                    previouslyExpandedEntryView!.collapse()
                    self.stackView.layoutIfNeeded()
                })
            }
        }

        class EntryView : UIView {
            var tapHandler: (EntryView) -> Void
            var contentHeightConstraint: NSLayoutConstraint
            var tapDirection: UIImageView
            
            required init(entry: AuctionInformation.FAQEntry, textDelegate: ARTextViewDelegate, tapHandler: (EntryView) -> Void) {
                self.tapHandler = tapHandler
                
                let topBorder = UIView()
                topBorder.backgroundColor = .artsyLightGrey()
                
                let titleButton = UIButton(type: .Custom)
                
                let titleLabel = UILabel()
                titleLabel.text = entry.name.uppercaseString
                titleLabel.numberOfLines = 1
                titleLabel.backgroundColor = UIColor.clearColor()
                titleLabel.font = UIFont.sansSerifFontWithSize(12)

                let arrowIndicator = UIImageView(image: UIImage(named:"navigation_more_arrow_vertical"))
                self.tapDirection = arrowIndicator
                
                let contentView = ARTextView()
                contentView.scrollEnabled = true
                
                /// The API comes with headers we should remove
                let content = entry.content.stringByRemovingLinesMatching { $0.hasPrefix("#") }
                contentView.setMarkdownString(content)
                contentView.viewControllerDelegate = textDelegate
                
                self.contentHeightConstraint = contentView.constrainHeight("0").first as! NSLayoutConstraint
                
                super.init(frame: CGRectZero)
                
                titleButton.addTarget(self, action: "didTap", forControlEvents: .TouchUpInside)
                
                addSubview(topBorder)
                addSubview(titleButton)
                titleButton.addSubview(titleLabel)
                titleButton.addSubview(arrowIndicator)
                addSubview(contentView)
                
                topBorder.constrainHeight("1")
                topBorder.alignTopEdgeWithView(self, predicate: "0")
                topBorder.alignLeading("0", trailing: "0", toView: self)
                
                titleLabel.alignTop("0", bottom: "0", toView: titleButton)
                titleLabel.alignLeading("20", trailing: "-20", toView: titleButton)
                
                titleButton.constrainHeight("50")
                titleButton.constrainTopSpaceToView(topBorder, predicate: "0")
                titleButton.alignLeading("0", trailing: "0", toView: self)

                arrowIndicator.alignTrailingEdgeWithView(titleButton, predicate: "-20")
                arrowIndicator.constrainTopSpaceToView(topBorder, predicate: "22")

                contentView.constrainTopSpaceToView(titleButton, predicate: "0")
                // Inset the text with text container insets, instead of leading/traling constraints, so that the
                // text view’s scroll bar is all the way the side of the entry view.
                contentView.textContainerInset = UIEdgeInsets(top: 0, left: 20, bottom: 0, right: 20)
                contentView.alignLeading("0", trailing: "0", toView: self)
                
                self.alignBottomEdgeWithView(contentView, predicate: "0")
            }
            
            required init?(coder aDecoder: NSCoder) {
                fatalError()
            }
            
            func expand() {
                contentHeightConstraint.active = false
                tapDirection.transform = CGAffineTransformMakeRotation(CGFloat(M_PI))
            }
            
            func collapse() {
                contentHeightConstraint.active = true
                tapDirection.transform = CGAffineTransformIdentity
            }
            
            func didTap() {
                tapHandler(self)
            }
        }
    }
}

extension String {
    func stringByRemovingLinesMatching(matcher: (String) -> (Bool)) -> String {
        let lines = self.componentsSeparatedByString("\n")
        return lines.filter { matcher($0) == false }.joinWithSeparator("\n")
    }
}
