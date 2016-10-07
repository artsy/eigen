import UIKit

enum GeneSortingOrder: String {
    case RecentlyAdded = "Recently Added"
    case LeastExpensive = "Least Expensive"
    case MostExpensive = "Most Expensive"

    static func allValues() -> [GeneSortingOrder] {
        return [RecentlyAdded, LeastExpensive, MostExpensive]
    }
}

struct GeneRefineSettings {
    let sort: GeneSortingOrder
    let medium: String
    let mediums: [String]
    var priceRange: PriceRange?

    static func refinementFromJSON(data: [String: AnyObject]) -> GeneRefineSettings {
        return GeneRefineSettings(sort: .RecentlyAdded, medium:"ok", mediums:["ok", "sure"], priceRange: (min:0, max: 50_000))
    }

    func toJSON() -> [String: AnyObject] {
        return [:]
    }
}

private let SortPosition = 0
private let SortPositionO = 0

extension GeneRefineSettings: RefinableType {

    var numberOfSections: Int {
        return 2
    }

    func numberOfRowsInSection(section: Int) -> Int {
        if section == SortPosition {
            return GeneSortingOrder.allValues().count
        } else {
            return mediums.count
        }
    }

    func titleOfSection(section: Int) -> String {
        if section == SortPosition {
            return "Sort"
        } else {
            return "Medium"
        }
    }

    func titleForRowAtIndexPath(indexPath: NSIndexPath) -> String {
        if indexPath.section == SortPosition {
            return GeneSortingOrder.allValues()[indexPath.row].rawValue
        } else {
            return mediums[indexPath.row]
        }
    }

    func allowMultipleSelectionInSection(section: Int) -> Bool {
        return false
    }

    func shouldCheckRowAtIndexPath(indexPath: NSIndexPath) -> Bool {
        if indexPath.section == SortPosition {
            return GeneSortingOrder.allValues()[indexPath.row] == sort
        } else {
            return mediums[indexPath.row] == medium
        }
    }

    func selectedRowsInSection(section: Int) -> [NSIndexPath] {
        if section == SortPosition {
            guard let indexPath = indexPathOfSelectedOrder() else { return [] }
            return [indexPath]
        } else {
            guard let indexPath = indexPathOfSelectedMedium() else { return [] }
            return [indexPath]
        }
    }

    var priceRangePrompt: String? {
        return nil
    }

    func refineSettingsWithPriceRange(range: PriceRange) -> GeneRefineSettings {
        return GeneRefineSettings(sort: sort, medium: medium, mediums: mediums, priceRange: range)
    }

    func refineSettingsWithSelectedIndexPath(indexPath: NSIndexPath) -> GeneRefineSettings {
        if indexPath.section == SortPosition {
            let newSort = GeneSortingOrder.allValues()[indexPath.row]
            return GeneRefineSettings(sort: newSort, medium: medium, mediums: mediums, priceRange: priceRange)

        } else {
            let newMedium = mediums[indexPath.row]
            return GeneRefineSettings(sort: sort, medium: newMedium, mediums: mediums, priceRange: priceRange)
        }
    }

    func indexPathOfSelectedOrder() -> NSIndexPath? {
        if let i = GeneSortingOrder.allValues().indexOf(sort) {
            return NSIndexPath.init(forItem: i, inSection: 0)
        }
        return nil
    }

    func indexPathOfSelectedMedium() -> NSIndexPath? {
        if let i = mediums.indexOf(medium) {
            return NSIndexPath.init(forItem: i, inSection: 1)
        }
        return nil
    }
}

extension GeneRefineSettings: Equatable {}

func == (lhs: GeneRefineSettings, rhs: GeneRefineSettings) -> Bool {
    guard lhs.sort == rhs.sort else { return false }
    guard lhs.medium == rhs.medium else { return false }

    if let lhsRange = lhs.priceRange, rhsRange = rhs.priceRange {
        guard lhsRange.min == rhsRange.min else { return false }
        guard lhsRange.max == rhsRange.max else { return false }
    }
    return true
}
