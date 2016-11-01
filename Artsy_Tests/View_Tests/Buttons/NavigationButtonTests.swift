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

        typealias CallbackBlock = @convention (block) (UIButton) -> Void

        it("maps handler correctly") {
            var called = false

            let subject = NavigationButton(buttonClass: UIButton.self, properties: ["key": "value"], handler: { _ in called = true })
            let handler = unsafeBitCast(subject.descriptionDictionary[ARNavigationButtonHandlerKey], CallbackBlock.self)
            handler(UIButton())

            expect(called) == true
        }
    }
}
