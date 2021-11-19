import XCTest

class ScheduleTests: XCTestCase {
    // it returns an array of dates that match our schedule (8am, noon, 4pm, 8pm)
    func testHoursOfUpdate() throws {
        let times = Schedule.generate()
        let hours: [Int] = times.map() { Calendar.current.component(.hour, from: $0) }

        XCTAssertEqual(hours, [8, 12, 16, 20])
    }
    
    // it returns a date that is 20 hours from the morning time
    func testNextUpdateIn20Hours() throws {
        let formatter = Foundation.ISO8601DateFormatter()
        let morning = formatter.date(from: "2021-11-16T08:00:00Z")!

        let updateTimes = [morning]
        let schedule = Schedule(tomorrow: Schedule.tomorrow, updateTimes: updateTimes)
        let nextTime = schedule.nextUpdate
        
        XCTAssertEqual(formatter.string(from: nextTime), "2021-11-17T04:00:00Z")
    }
    
    // it returns tomorrow when morning is not provided
    func testNextUpdateFallsBack() throws {
        let schedule = Schedule(tomorrow: Schedule.tomorrow, updateTimes: [])
        let nextTime = schedule.nextUpdate
        
        XCTAssertEqual(nextTime, Schedule.tomorrow)
    }
}
