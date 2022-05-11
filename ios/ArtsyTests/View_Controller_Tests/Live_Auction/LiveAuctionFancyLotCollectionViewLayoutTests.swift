import Quick
import Nimble
import UIKit
import Nimble_Snapshots

@testable
import Artsy

class LiveAuctionFancyLotCollectionViewLayoutTests: QuickSpec {
    override func spec() {

        // This is test target-wide.
        beforeSuite {
            let fake = stub_auctionSalesPerson()
            for i in 0..<fake.lotCount {
                let lot = fake.lotViewModelForIndex(i)
                cacheColoredImageForURL(lot.urlForThumbnail)
            }
        }

        let frame = CGRect(x: 0, y: 0, width: 400, height: 400)
        var subject: LiveAuctionFancyLotCollectionViewLayout!
        var collectionView: UICollectionView!
        var dataSource: LiveAuctionLotCollectionViewDataSource!
        var container: UIView!
        var salesPerson: LiveAuctionsSalesPersonType!
        let rect = CGRect(x: 400, y: 0, width: 400, height: 400)

        it("looks good compact") {
            salesPerson = stub_auctionSalesPerson()
            dataSource = LiveAuctionLotCollectionViewDataSource(salesPerson: salesPerson)
            subject = LiveAuctionFancyLotCollectionViewLayout(delegate: dataSource, size: .compact)
            collectionView = UICollectionView(frame: frame, collectionViewLayout: subject)
            collectionView.register(LiveAuctionLotImageCollectionViewCell.self, forCellWithReuseIdentifier: LiveAuctionLotCollectionViewDataSource.CellIdentifier)
            collectionView.dataSource = dataSource
            collectionView.backgroundColor = .white
            container = UIView(frame: frame).then {
                $0.addSubview(collectionView)
                collectionView.align(toView: $0)
            }

            collectionView.scrollRectToVisible(rect, animated: false)

            expect(container) == snapshot()
        }

        describe("normal size") {
            beforeEach {
                salesPerson = stub_auctionSalesPerson()
                dataSource = LiveAuctionLotCollectionViewDataSource(salesPerson: salesPerson)
                subject = LiveAuctionFancyLotCollectionViewLayout(delegate: dataSource, size: .normal)
                collectionView = UICollectionView(frame: frame, collectionViewLayout: subject)
                collectionView.register(LiveAuctionLotImageCollectionViewCell.self, forCellWithReuseIdentifier: LiveAuctionLotCollectionViewDataSource.CellIdentifier)
                collectionView.dataSource = dataSource
                collectionView.backgroundColor = .white

                container = UIView(frame: frame).then {
                    $0.addSubview(collectionView)
                    collectionView.align(toView: $0)
                }

                collectionView.scrollRectToVisible(rect, animated: false)
            }

            it("looks good by default") {
                expect(container) == snapshot()
            }

            it("looks good when scrolled back a bit") {
                collectionView.setContentOffset(CGPoint(x: rect.origin.x-100, y: 0), animated: false) // simulates a scroll
                collectionView.reloadData()
                expect(container) == snapshot()
            }

            it("looks good when scrolled back a lot") {
                collectionView.setContentOffset(CGPoint(x: rect.origin.x-201, y: 0), animated: false) // simulates a scroll
                collectionView.reloadData()
                expect(container) == snapshot()
            }

            it("looks good when scrolled forward a bit") {
                collectionView.setContentOffset(CGPoint(x: rect.origin.x+100, y: 0), animated: false) // simulates a scroll
                collectionView.reloadData()
                expect(container) == snapshot()
            }

            it("looks good when scrolled forward a lot") {
                collectionView.setContentOffset(CGPoint(x: rect.origin.x+201, y: 0), animated: false) // simulates a scroll
                collectionView.reloadData()
                expect(container) == snapshot()
            }
        }

    }
}
