import UIKit
import SwiftyJSON

enum GeneSortingOrder: String {
    case RecentlyAdded = "Recently Added"
    case LeastExpensive = "Least Expensive"
    case MostExpensive = "Most Expensive"

    static func allValues() -> [GeneSortingOrder] {
        return [RecentlyAdded, LeastExpensive, MostExpensive]
    }

    static func fromID(_ id: String) -> GeneSortingOrder? {
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
            return Int(id.components(separatedBy: "-*").first!)!
        } else if id.contains("-") {
            return Int(id.components(separatedBy: "-").last!)!
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

    static func refinementFromAggregationJSON(_ data: [String: AnyObject]) -> GeneRefineSettings? {
        let json = JSON(data)
        guard let aggregations = json["aggregations"].array,
            let sort = json["sort"].string, let sorting = GeneSortingOrder.fromID(sort),
            let mediumID = json["selectedMedium"].string else { return nil }

        let prices = aggregations.filter({ $0["slice"].stringValue == "PRICE_RANGE" }).first?["counts"].arrayValue.map({ Price(id: $0["id"].stringValue, name: $0["name"].stringValue) })

        let maxPrice = prices?.sorted(by: >).first

        guard let mediumsJSON = aggregations.filter({ $0["slice"].stringValue == "MEDIUM" }).first else { return nil }
        let mediums = mediumsJSON["counts"].arrayValue.map({ Medium(id: $0["id"].stringValue, name: $0["name"].stringValue) })

        guard let selectedMedium = mediums.first({ $0.id == mediumID }) else { return nil }

        return GeneRefineSettings(sort: sorting, medium: selectedMedium, mediums:mediums, priceRange: maxPrice?.priceRange())
    }

    func toJSON() -> [String: AnyObject] {

        let priceRangeID = (priceRange != nil) ? "\(priceRange?.min)-\(priceRange?.max)" : "*-*"
        return [
            "sort": sort.toID() as AnyObject,
            "selectedPrice": priceRangeID as AnyObject,
            "medium" : medium.id as AnyObject
        ]
    }
}

private let SortPosition = 0

extension GeneRefineSettings: RefinableType {

    var numberOfSections: Int {
        return 2
    }

    func numberOfRowsInSection(_ section: Int) -> Int {
        if section == SortPosition {
            return GeneSortingOrder.allValues().count
        } else {
            return mediums.count
        }
    }

    func titleOfSection(_ section: Int) -> String {
        if section == SortPosition {
            return "Sort"
        } else {
            return "Medium"
        }
    }

    func titleForRowAtIndexPath(_ indexPath: IndexPath) -> String {
        if indexPath.section == SortPosition {
            return GeneSortingOrder.allValues()[indexPath.row].rawValue
        } else {
            return mediums[indexPath.row].name
        }
    }

    func allowMultipleSelectionInSection(_ section: Int) -> Bool {
        return false
    }

    func shouldCheckRowAtIndexPath(_ indexPath: IndexPath) -> Bool {
        if indexPath.section == SortPosition {
            return GeneSortingOrder.allValues()[indexPath.row] == sort
        } else {
            return mediums[indexPath.row].id == medium.id
        }
    }

    func selectedRowsInSection(_ section: Int) -> [IndexPath] {
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

    func refineSettingsWithPriceRange(_ range: PriceRange) -> GeneRefineSettings {
        return GeneRefineSettings(sort: sort, medium: medium, mediums: mediums, priceRange: range)
    }

    func refineSettingsWithSelectedIndexPath(_ indexPath: IndexPath) -> GeneRefineSettings {
        if indexPath.section == SortPosition {
            let newSort = GeneSortingOrder.allValues()[indexPath.row]
            return GeneRefineSettings(sort: newSort, medium: medium, mediums: mediums, priceRange: priceRange)

        } else {
            let newMedium = mediums[indexPath.row]
            return GeneRefineSettings(sort: sort, medium: newMedium, mediums: mediums, priceRange: priceRange)
        }
    }

    func indexPathOfSelectedOrder() -> IndexPath? {
        if let i = GeneSortingOrder.allValues().index(of: sort) {
            return IndexPath.init(item: i, section: 0)
        }
        return nil
    }

    func indexPathOfSelectedMedium() -> IndexPath? {
        if let i = mediums.index(of: medium) {
            return IndexPath.init(item: i, section: 1)
        }
        return nil
    }
}

extension GeneRefineSettings: Equatable {}

func == (lhs: GeneRefineSettings, rhs: GeneRefineSettings) -> Bool {
    guard lhs.sort == rhs.sort else { return false }
    guard lhs.medium == rhs.medium else { return false }

    if let lhsRange = lhs.priceRange, let rhsRange = rhs.priceRange {
        guard lhsRange.min == rhsRange.min else { return false }
        guard lhsRange.max == rhsRange.max else { return false }
    }
    return true
}
