import UIKit
import SwiftyJSON

enum GeneSortingOrder: String {
    case RecentlyAdded = "Recently Added"
    case LeastExpensive = "Least Expensive"
    case MostExpensive = "Most Expensive"

    static func allValues() -> [GeneSortingOrder] {
        return [RecentlyAdded, LeastExpensive, MostExpensive]
    }

    static func fromID(id: String) -> GeneSortingOrder? {
        switch id {
        case "-year":
            return .RecentlyAdded
        case "-prices":
            return .LeastExpensive
        case "prices":
            return .MostExpensive
        default:
            return nil
        }
    }

    func toID() -> String {
        switch self {
        case .RecentlyAdded:
            return "-year"
        case .LeastExpensive:
            return "-prices"
        case .MostExpensive:
            return "prices"
        }
    }
}

struct Medium {
    let id: String
    let name: String
}

extension Medium: Equatable {}

func == (lhs: Medium, rhs: Medium) -> Bool {
    return lhs.id == rhs.id
}

struct Price {
    let id: String
    let name: String

    func maxPrice() -> Int {
        if id == "*-*" {
            return 0
        } else if id.hasSuffix("-*") {
            // max can be represented as "XXX-*"
            return Int(id.componentsSeparatedByString("-*").first!)!
        } else if id.containsString("-") {
            return Int(id.componentsSeparatedByString("-").last!)!
        }
        return 0
    }

    func priceRange() -> PriceRange {
        return (min:0, max: maxPrice())
    }

    func representedPriceID() -> String {
        if maxPrice() == 0 {
            return "*-*"
        } else {
            return "0-\(maxPrice())"
        }
    }
}


extension Price: Equatable {}

func == (lhs: Price, rhs: Price) -> Bool {
    return lhs.id == rhs.id
}

func > (lhs: Price, rhs: Price) -> Bool {
    return lhs.maxPrice() > rhs.maxPrice()
}

struct GeneRefineSettings {
    let sort: GeneSortingOrder
    let medium: Medium
    let mediums: [Medium]
    var priceRange: PriceRange?

    static func refinementFromAggregationJSON(data: [String: AnyObject]) -> GeneRefineSettings? {
        let json = JSON(data)
        guard let aggregations = json["aggregations"].array,
            sort = json["sort"].string, sorting = GeneSortingOrder.fromID(sort),
            mediumID = json["selectedMedium"].string else { return nil }

        let prices = aggregations.filter({ $0["slice"].stringValue == "PRICE_RANGE" }).first?["counts"].arrayValue.map({ Price(id: $0["id"].stringValue, name: $0["name"].stringValue) })

        let maxPrice = prices?.sort(>).first

        guard let mediumsJSON = aggregations.filter({ $0["slice"].stringValue == "MEDIUM" }).first else { return nil }
        let mediums = mediumsJSON["counts"].arrayValue.map({ Medium(id: $0["id"].stringValue, name: $0["name"].stringValue) })

        guard let selectedMedium = mediums.first({ $0.id == mediumID }) else { return nil }

        return GeneRefineSettings(sort: sorting, medium: selectedMedium, mediums:mediums, priceRange: maxPrice?.priceRange())
    }

    func toJSON() -> [String: AnyObject] {

        let priceRangeID = (priceRange != nil) ? "\(priceRange?.min)-\(priceRange?.max)" : "*-*"
        return [
            "sort": sort.toID(),
            "selectedPrice": priceRangeID,
            "medium" : medium.id
        ]
    }
}

private let SortPosition = 0

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
            return mediums[indexPath.row].name
        }
    }

    func allowMultipleSelectionInSection(section: Int) -> Bool {
        return false
    }

    func shouldCheckRowAtIndexPath(indexPath: NSIndexPath) -> Bool {
        if indexPath.section == SortPosition {
            return GeneSortingOrder.allValues()[indexPath.row] == sort
        } else {
            return mediums[indexPath.row].id == medium.id
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
