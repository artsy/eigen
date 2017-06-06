import UIKit
import FLKAutoLayout
import SDWebImage

class LotStandingsLotView: UIView {
    typealias Config = (lotStanding: LotStanding, drawBottomBorder: Bool, isCompact: Bool)
    typealias TappedClosure = () -> Void

    @IBOutlet weak var bottomBorder: UIView!
    @IBOutlet weak var imageView: UIImageView!
    @IBOutlet weak var bidStatusLabel: UILabel!
    @IBOutlet weak var currentBidLabel: UILabel!
    @IBOutlet weak var lotNumberLabel: UILabel!
    @IBOutlet weak var artistNameLabel: UILabel!
    @IBOutlet weak var artworkNameLabel: UILabel!

    var config: Config? {
        didSet {
            setup()
        }
    }

    var tappedClosure: TappedClosure?

    static func fromNib(isCompact: Bool, lotStanding: LotStanding, drawBottomBorder: Bool) -> LotStandingsLotView? {
        let nibName = "LotStandingsLotView" + (isCompact ? "Compact" : "Regular")
        let nib = UINib(nibName: nibName, bundle: nil)

        guard let views = nib.instantiate(withOwner: nil, options: nil) as? [UIView] else {
            return nil
        }
        guard let view = views.first as? LotStandingsLotView else {
            return nil
        }

        view.translatesAutoresizingMaskIntoConstraints = false
        view.config = (lotStanding: lotStanding, drawBottomBorder: drawBottomBorder, isCompact: isCompact)
        view.constrainHeight(isCompact ? "160" : "140")

        return view
    }
}

private typealias PrivateFunctions = LotStandingsLotView
extension LotStandingsLotView {
    func setup() {
        guard let config = config, let saleArtwork = config.lotStanding.saleArtwork else { return }

        // Config-specific setup
        bottomBorder.isHidden = !config.drawBottomBorder
        imageView.sd_setImage(with: saleArtwork.artwork.urlForThumbnail())
        let bid = saleArtwork.currentBid.convertToDollarString(saleArtwork.currencySymbol)
        let numberOfBids = saleArtwork.numberOfBidsString()
        currentBidLabel.text = "\(bid) \(numberOfBids)"

        if let artworkName = saleArtwork.artwork.name() {
            if saleArtwork.artwork.date.isEmpty {
                artworkNameLabel.text = artworkName
            } else {
                artworkNameLabel.text = "\(artworkName), \(saleArtwork.artwork.date)"
            }
        } else {
            artworkNameLabel.text = nil
        }

        if let lotLabel = saleArtwork.lotLabel {
            lotNumberLabel.text = "Lot \(lotLabel)"
        } else {
            lotNumberLabel.text = "No Lot Number"
        }

        if let artist = saleArtwork.artwork.artist {
            artistNameLabel.text = artist.name
        } else {
            artistNameLabel.text = "No Artist"
        }

        if config.lotStanding.isLeading {
            if saleArtwork.reserveStatus == .reserveNotMet {
                bidStatusLabel.textColor = .artsyYellowBold()
            } else {
                bidStatusLabel.textColor = UIColor.auctionGreen()
            }
        } else {
            bidStatusLabel.text = "Outbid"
            bidStatusLabel.textColor = .auctionRed()
        }

        // UI setup that's hard to do in Interface Builder
        lotNumberLabel.resizeFont(to: 10)
        if config.isCompact {
            artistNameLabel.resizeFont(to: 14)
            artworkNameLabel.resizeFont(to: 14)
            currentBidLabel.resizeFont(to: 14)
            bidStatusLabel.resizeFont(to: 12)
        } else {
            artistNameLabel.font = UIFont.serifSemiBoldFont(withSize: 12)
            artworkNameLabel.resizeFont(to: 14)
            currentBidLabel.resizeFont(to: 12)
            bidStatusLabel.resizeFont(to: 10)
        }
        if let artworkName = saleArtwork.artwork.name() {
            artworkNameLabel.makeSubstring(artworkName, useFont: UIFont.serifItalicFont(withSize: artworkNameLabel.font.pointSize))
        }
        artistNameLabel.numberOfLines = 1
        artworkNameLabel.numberOfLines = 1

        setNeedsLayout()

        let tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(tapped))
        addGestureRecognizer(tapGestureRecognizer)
    }

    func tapped() {
        tappedClosure?()
    }
}
