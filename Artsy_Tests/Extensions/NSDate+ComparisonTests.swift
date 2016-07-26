import Quick
import Nimble
@testable
import Artsy

class NSDate_ComparisonTests: QuickSpec {
    override func spec() {
        var small: NSDate!
        var large: NSDate!

        beforeEach {
            small = NSDate(timeIntervalSinceReferenceDate: 100)
            large = NSDate(timeIntervalSinceReferenceDate: 1000)
        }

        it("returns true for ascending comparisons") {
            expect(small < large) == true
        }

        it("returns false for equal comparisons") {
            expect(small < small) == false
        }

        it("returns false for descending comparisons") {
            expect(large < small) == false
        }
    }
}
