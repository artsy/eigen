import UIKit
import SwiftyJSON

/// As the Refine setting uses a lot of Swift-specific features,
/// we need something to coordinate between the rest of our app
/// and the refine setting VC.

class RefineSwiftCoordinator : NSObject {
    @objc static func showRefineSettingForGeneSettings(_ viewController: UIViewController, initial: [String: AnyObject], current: [String: AnyObject], completion: @escaping (_ newRefineSettings: [String: AnyObject]?) -> ()) {
        guard let initialSettings = GeneRefineSettings.refinementFromAggregationJSON(initial, initial:true) else { return completion(nil) }
        guard let currentSettings = GeneRefineSettings.refinementFromAggregationJSON(current, initial:false) else { return completion(nil) }

        let optionsVC = RefinementOptionsViewController(defaultSettings: initialSettings, initialSettings: currentSettings, currencySymbol: "$", userDidCancelClosure: { (optionsVC) in
            completion(nil)
                viewController.dismiss(animated: true, completion: nil)

            }) { (newSettings) in
                                completion(newSettings.toJSON())
                viewController.dismiss(animated: true, completion: nil)

        }
        var properties = [String: Any]()
        properties["owner_type"] = "gene"
        properties["owner_id"] = ""
        properties["owner_slug"] = ""
        properties["partial"] = "true"
        optionsVC.viewDidAppearAnalyticsOption = RefinementAnalyticsOption(name: "Category refine", properties: properties)
        
        viewController.present(optionsVC, animated: true, completion: nil)
    }
}

enum GeneSortingOrder: String {
    case RecentlyUpdated = "Recently Updated"
    case LeastExpensive = "Least Expensive"
    case MostExpensive = "Most Expensive"

    static func allValues() -> [GeneSortingOrder] {
        return [RecentlyUpdated, LeastExpensive, MostExpensive]
    }

    static func fromID(_ id: String) -> GeneSortingOrder? {
        switch id {
        case "-partner_updated_at":
            return .RecentlyUpdated
        case "prices":
            return .LeastExpensive
        case "-prices":
            return .MostExpensive
        default:
            return nil
        }
    }

    func toID() -> String {
        switch self {
        case .RecentlyUpdated:
            return "-partner_updated_at"
        case .LeastExpensive:
            return "prices"
        case .MostExpensive:
            return "-prices"
        }
    }
}

struct Medium {
    let id: String
    let name: String
    let count: Int
}

extension Medium: Equatable {}

func == (lhs: Medium, rhs: Medium) -> Bool {
    return lhs.id == rhs.id
}

struct Price {
    let id: String

    /// Generates a cents based price for the Refine settings
    func maxPrice() -> Int {
        if id == "*-*" {
            // There will always be a from star to star
            return 0
        } else if id.hasSuffix("-*") {
            // max can be represented as "XXX-*"
            return Int(id.components(separatedBy: "-*").first!)!
        } else if id.contains("-") {
            return Int(id.components(separatedBy: "-").last!)!
        }
        return 0
    }

    // Min Price
    func minPrice() -> Int {
        if id == "*-*" {
            return 0
        } else if !id.hasPrefix("*-") && id.contains("-") {
            return Int(id.components(separatedBy: "-").first!)!
        }
        return 0
    }

    func centsPriceRange() -> PriceRange {
        return (min:minPrice() * 100, max: maxPrice() * 100)
    }

    func dollarsPriceRange() -> PriceRange {
        return (min:minPrice(), max: maxPrice())
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
    let medium: Medium?
    let mediums: [Medium]
    var priceRange: PriceRange?

    static func refinementFromAggregationJSON(_ data: [String: AnyObject], initial: Bool) -> GeneRefineSettings? {
        let json = JSON(data)
        guard let aggregations = json["aggregations"].array,
            let sort = json["sort"].string,
            let sorting = GeneSortingOrder.fromID(sort),
            let mediumID = json["selectedMedium"].string else {
                print("Gene Refine from JSON: Either aggregations, sort or selectedMedium were missing or set up wrong")
                print(data)
                return nil
        }

        let price: Price?
        // The initial settings should always span the full price spectrum, as should non-specific selected prices.
        if (initial || json["selectedPrice"].string == nil || json["selectedPrice"].string == "*-*") {
            let prices = aggregations.filter({ $0["slice"].stringValue == "PRICE_RANGE" }).first?["counts"].arrayValue.map({ Price(id: $0["value"].stringValue) })
            guard let maxPrice = prices?.sorted(by: >).first else { return nil }
            price = Price(id: "0-\(maxPrice.maxPrice())")
        } else {
            price = Price(id: json["selectedPrice"].string!)
        }

        guard let mediumsJSON = aggregations.filter({ $0["slice"].stringValue == "MEDIUM" }).first else {
            print("Gene Refine from JSON: No aggregation slice contained MEDIUM")
            print(data)
            return nil
        }
        let mediums = mediumsJSON["counts"].arrayValue.map({ Medium(id: $0["value"].stringValue, name: $0["name"].stringValue, count: $0["count"].intValue) })

        let allowedMediums = mediums.filter { $0.count > 0 }
        let allMedium = Medium(id: "*", name: "All Mediums", count: 1)
        let allMediums = [allMedium] + allowedMediums
        let selectedMedium = allMediums.first({ $0.id == mediumID })

        return GeneRefineSettings(sort: sorting, medium: selectedMedium, mediums:allMediums, priceRange: price?.centsPriceRange())
    }

    func emissionPriceRange(_ priceRange: PriceRange) -> String {
        var dollarsMax = Double(priceRange.max / 100)
        let dollarsMin = priceRange.min / 100
        // If it's a large number, round it down to be 
        // consistent with what we show in the user interface
        if dollarsMax > 1000 {
            dollarsMax = floor(dollarsMax / 1000) * 1000
        }
        return "\(dollarsMin)-\(Int(dollarsMax))"
    }

    func toJSON() -> [String: AnyObject] {
        let priceRangeID = (priceRange != nil) ? emissionPriceRange(priceRange!) : "*-*"
        let mediumID = (medium != nil) ? medium!.id : "*"
        return [
            "sort": sort.toID() as AnyObject,
            "selectedPrice": priceRangeID  as AnyObject,
            "medium" : mediumID as AnyObject
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
            return (medium != nil) && mediums[indexPath.row].id == medium!.id
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
        guard let medium = medium else { return nil }
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
