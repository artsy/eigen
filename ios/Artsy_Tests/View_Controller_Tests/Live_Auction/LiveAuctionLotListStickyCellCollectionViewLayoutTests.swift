import Quick
import Nimble
import UIKit
import Nimble_Snapshots

@testable
import Artsy


class LiveAuctionLotListStickyCellCollectionViewLayoutTests: QuickSpec {
    override func spec() {
        let frame = CGRect(x: 0, y: 0, width: 100, height: 400)
        var subject: LiveAuctionLotListStickyCellCollectionViewLayout!
        var collectionView: UICollectionView!
        var dataSource: Test_CollectionViewDataSource!
        var container: UIView!

        beforeEach {
            subject = LiveAuctionLotListStickyCellCollectionViewLayout()
            subject.setActiveIndex(0)
            collectionView = UICollectionView(frame: frame, collectionViewLayout: subject)
            collectionView.register(Test_CollectionViewCell.self, forCellWithReuseIdentifier: Test_CollectionViewDataSource.CellIdentifier)
            dataSource = Test_CollectionViewDataSource()
            collectionView.dataSource = dataSource
            container = UIView(frame: frame).then {
                $0.addSubview(collectionView)
                collectionView.align(toView: $0)
            }
        }

        it("looks good by default") {
            expect(container) == snapshot()
        }

        it("looks good when stuck to the top") {
            collectionView.setContentOffset(CGPoint(x: 0, y: 100), animated: false) // simulates a scroll
            expect(container) == snapshot()
        }

        it("looks good when stuck to the bottom") {
            dataSource.index = 8
            collectionView.reloadData()
            subject.setActiveIndex(8)

            expect(container) == snapshot()
        }
    }
}

class Test_CollectionViewDataSource: NSObject, UICollectionViewDataSource {
    static let CellIdentifier = "Cell"

    var index = 0
    var numberOfItems = 10

    override init() {
        super.init()
    }

    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return numberOfItems
    }

    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: Test_CollectionViewDataSource.CellIdentifier, for: indexPath) as! Test_CollectionViewCell

        if indexPath.item == index {
            cell.backgroundColor = .red
        } else {
            cell.backgroundColor = .gray
        }

        cell.label.text = "\(indexPath.item)"

        return cell
    }
}

class Test_CollectionViewCell: UICollectionViewCell {
    let label = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)

        contentView.addSubview(label)
        label.align(toView: contentView)
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }
}
