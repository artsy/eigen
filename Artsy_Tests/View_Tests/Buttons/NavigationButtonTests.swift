import Quick
import Nimble
@testable
import Artsy

class NavigationButtonTests: QuickSpec {
    override func spec() {
        it("maps class correctly") {
            let subject = NavigationButton(buttonClass: UIButton.self, properties: ["key": "value"], handler: { _ in })

            expect(subject.descriptionDictionary[ARNavigationButtonClassKey] as? UIButton.Type).toNot( beNil() )
        }

        it("maps properties correctly") {
            let subject = NavigationButton(buttonClass: UIButton.self, properties: ["key": "value"], handler: { _ in })

            expect(subject.descriptionDictionary[ARNavigationButtonPropertiesKey] as? NSDictionary) == ["key": "value"] as NSDictionary
        }

        it("maps handler correctly") {
            let subject = NavigationButton(buttonClass: UIButton.self, properties: ["key": "value"], handler: { _ in })
            let handler = subject.descriptionDictionary[ARNavigationButtonHandlerKey]

            expect(handler).toNot( beNil () )
        }
    }
}
