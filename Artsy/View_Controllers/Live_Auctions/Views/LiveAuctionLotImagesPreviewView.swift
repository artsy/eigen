import UIKit
import Interstellar
import AVFoundation

/// This is a proof of concept, needs more work ( needs far left / far right views for example
/// and to deal with transforms/ opacity

/// Note: currently un-used, 
/// it used to go in ViewDidLoad for LiveAuctionLotsViewController

/**
    // This sits _behind_ the PageViewController, which is transparent and shows it through
    // meaning interaction is handled by a ScrollViewProgressObserver

    let previewView = LiveAuctionLotImagesPreviewView(progressSignal: scrollManager.progress, nextSignal: salesPerson.currentIndexSignal, salesPerson: salesPerson)
    view.addSubview(previewView)
    previewView.constrainHeight("300")
    previewView.constrainTopSpaceToView(navToolbar, predicate: "10")
    previewView.alignLeadingEdgeWithView(view, predicate: "0")
    previewView.alignTrailingEdgeWithView(view, predicate: "0")
**/

class LiveAuctionLotImagesPreviewView : UIView {
    let progress: Signal<CGFloat>
    let salesPerson: LiveAuctionsSalesPersonType

    var leftLeftImageView, leftImageView, rightRightImageView, rightImageView, centerImageView: UIImageView

    init(progressSignal: Signal<CGFloat>, nextSignal: Signal<Int>, salesPerson: LiveAuctionsSalesPersonType) {
        self.salesPerson = salesPerson
        self.progress = progressSignal

        leftImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))
        leftLeftImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))
        centerImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))
        rightImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))
        rightRightImageView = UIImageView(frame: CGRectMake(0, 0, 140, 140))

        let imageViews = [leftLeftImageView, leftImageView, rightImageView, rightRightImageView, centerImageView]

        super.init(frame: CGRect.zero)

        for image in imageViews {
            addSubview(image)
            image.backgroundColor = .artsyGrayRegular()
        }

        progressSignal.next { progress in
            let width = Int(self.bounds.width)
            let half = Int(width / 2)

            self.leftLeftImageView.center = self.positionOnRange(-width...0, value: progress)
            self.leftImageView.center = self.positionOnRange((-half - 0)...half, value: progress)
            self.centerImageView.center = self.positionOnRange(0...width, value: progress)
            self.rightImageView.center = self.positionOnRange(half...width + half, value: progress)
            self.rightRightImageView.center = self.positionOnRange(width...width * 2, value: progress)
        }

        nextSignal.next { _ in
            let imageViews = [self.leftLeftImageView, self.leftImageView, self.centerImageView, self.rightImageView, self.rightRightImageView]
            let indexes = [-2, -1, 0, 1, 2]

            for index in indexes {
                if let vm = salesPerson.lotViewModelRelativeToShowingIndex(index) {
                    let imageViewIndex = indexes.indexOf { $0 == index }!

                    let imageView = imageViews[imageViewIndex]
                    imageView.ar_setImageWithURL(vm.urlForThumbnail)
                    let size = vm.imageProfileSize
                    let aspectRatio =  size.width / size.height

                    imageView.frame = AVMakeRectWithAspectRatioInsideRect(
                        CGSizeMake(aspectRatio, 1),
                        CGRect(x: 0, y: 0, width: 180, height: 300)
                    )
                }
            }
        }
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        progress.update(0)
    }

    func valueOnRange(range: Range<Int>, value: CGFloat) -> CGFloat {
        let min = CGFloat(range.minElement()!)
        let max = CGFloat(range.maxElement()!)

        let midpoint = (min + max) / 2
        let offset: CGFloat
        if value == 0 {
            offset = 0
        } else if value > 0 {
            offset = (max - midpoint) * value
        } else {
            offset = (midpoint - min) * value
        }
        return midpoint + offset
    }

    func positionOnRange(range: Range<Int>, value: CGFloat) -> CGPoint {
        let x = valueOnRange(range, value: value)
        return CGPoint(x: x, y: bounds.height / 2)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

/// Handles passing out information about the scroll progress to others

/**
  in the ViewController:

    let scrollManager = ScrollViewProgressObserver()

  once a paging view controller is set up:

    if let scrollView = pageController.view.subviews.filter({ $0.isKindOfClass(UIScrollView.self) }).first as? UIScrollView {
    scrollView.delegate = scrollManager
    }
**/


class ScrollViewProgressObserver : NSObject, UIScrollViewDelegate {
    let progress = Signal<CGFloat>()

    func scrollViewDidScroll(scrollView: UIScrollView) {
        let point = scrollView.contentOffset

        // Creates a value from -1 to 0 to 1
        let index = (point.x - scrollView.frame.width) / scrollView.frame.width * -1;
        progress.update(index)
    }
}
