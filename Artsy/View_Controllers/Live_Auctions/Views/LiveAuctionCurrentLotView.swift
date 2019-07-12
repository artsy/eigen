import UIKit
import Interstellar


class LiveAuctionCurrentLotView: UIButton {

    let viewModel: Observable<LiveAuctionLotViewModelType?>
    let salesPerson: LiveAuctionsSalesPersonType
    
    var currentBidObserverToken: ObserverToken<CurrentBid>?

    init(viewModel: Observable<LiveAuctionLotViewModelType?>, salesPerson: LiveAuctionsSalesPersonType) {
        self.viewModel = viewModel
        self.salesPerson = salesPerson

        super.init(frame: CGRect.zero)

        backgroundColor = .artsyPurpleRegular()
        layer.cornerRadius = 10

        let liveLotLabel = ARSansSerifLabel()
        liveLotLabel.font = .sansSerifFont(withSize: 12)
        liveLotLabel.text = "Live Lot"

        let artistNameLabel = UILabel()
        artistNameLabel.font = .serifSemiBoldFont(withSize: 16)

        let biddingPriceLabel = ARSansSerifLabel()
        biddingPriceLabel.font = .sansSerifFont(withSize: 16)
        biddingPriceLabel.textAlignment = .right
        biddingPriceLabel.setContentCompressionResistancePriority(UILayoutPriority.defaultHigh, for: .horizontal)

        let hammerView = UIImageView(image: UIImage(asset: .Lot_bidder_hammer_white))
        let thumbnailView = UIImageView(frame: CGRect(x: 0, y: 0, width: 40, height: 40))
        thumbnailView.contentMode = .scaleAspectFit

        [liveLotLabel, artistNameLabel, biddingPriceLabel, thumbnailView, hammerView].forEach { addSubview($0) }
        [liveLotLabel, artistNameLabel, biddingPriceLabel].forEach {
            $0.backgroundColor = backgroundColor
            $0.textColor = .white
        }

        constrainHeight("54")

        // Left Side

        thumbnailView.alignLeadingEdge(withView: self, predicate: "10")
        thumbnailView.constrainWidth("38", height: "38")
        thumbnailView.alignCenterY(withView: self, predicate: "0")
        thumbnailView.layer.cornerRadius = 5
        thumbnailView.layer.masksToBounds = true;

        liveLotLabel.constrainLeadingSpace(toView: thumbnailView, predicate: "10")
        liveLotLabel.alignTopEdge(withView: self, predicate: "10")
        liveLotLabel.constrainTrailingSpace(toView: biddingPriceLabel, predicate: "-10")

        artistNameLabel.constrainLeadingSpace(toView: thumbnailView, predicate: "10")
        artistNameLabel.alignBottomEdge(withView: self, predicate: "-10")
        artistNameLabel.constrainTrailingSpace(toView: biddingPriceLabel, predicate: "-10")

        // Right side

        hammerView.alignTrailingEdge(withView: self, predicate: "-10")
        hammerView.constrainWidth("32", height: "32")
        hammerView.alignCenterY(withView: self, predicate: "0")

        biddingPriceLabel.alignAttribute(.trailing, to: .leading, ofView: hammerView, predicate: "-12")
        biddingPriceLabel.alignCenterY(withView: self, predicate: "0")

        viewModel.subscribe { [weak artistNameLabel, weak biddingPriceLabel, weak thumbnailView, weak self] vm in
            guard let vm = vm else { return }
            
            self?.currentBidObserverToken?.unsubscribe()
            self?.currentBidObserverToken = vm.currentBidSignal.subscribe({ _ in
                biddingPriceLabel?.text = self?.salesPerson.currentLotValueString(vm) ?? ""
            })

            artistNameLabel?.text = vm.lotArtist
            biddingPriceLabel?.text = self?.salesPerson.currentLotValueString(vm) ?? ""
            thumbnailView?.ar_setImage(with: vm.urlForThumbnail)
        }
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    deinit {
        currentBidObserverToken?.unsubscribe()
    }
}
