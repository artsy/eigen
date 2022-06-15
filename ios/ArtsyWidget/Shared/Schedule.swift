import Foundation

struct Schedule {
    static let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
    
    static func generate() -> [Date] {
        let now = Date()
        let nowComponents = Calendar.current.dateComponents([.year, .month, .day], from: now)
        
        let times: [Date] = [8, 12, 16, 20].compactMap() { hour in
            let components = DateComponents(
                year: nowComponents.year,
                month: nowComponents.month,
                day: nowComponents.day,
                hour: hour
            )
            
            return Calendar.current.date(from: components)
        }
        
        return times
    }
    
    var updateTimes: [Date] = []
    
    let tomorrow: Date
    
    var nextUpdate: Date {
        guard
            let morning = updateTimes.first,
            let nextTime = Calendar.current.date(byAdding: .hour, value: 20, to: morning)
        else {
            return tomorrow
        }
        
        return nextTime
    }
    
    init(tomorrow: Date = Schedule.tomorrow, updateTimes: [Date]? = nil) {
        self.tomorrow = tomorrow
        self.updateTimes = updateTimes ?? Schedule.generate()
    }
}
