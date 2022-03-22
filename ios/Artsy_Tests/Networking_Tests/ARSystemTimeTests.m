#import "ArtsyAPI.h"
#import "ARSystemTime.h"
#import "ARNetworkConstants.h"

SpecBegin(ARSystemTimeTests);

beforeEach(^{
    [ARSystemTime reset];
    [OHHTTPStubs stubJSONResponseAtPath:ARSystemTimeURL withResponse:@{
        @"time": @"2422-03-24T13:29:34Z",
        @"day": @(24),
        @"wday": @(4),
        @"month": @(3),
        @"year": @(2422),
        @"hour": @(13),
        @"min": @(29),
        @"sec": @(34),
        @"dst": @(NO),
        @"unix": @(1395926974),
        @"utc_offset": @(0),
        @"zone": @"UTC",
        @"iso8601": @"2422-03-24T13:29:34Z"
    }];
});

afterEach(^{
    [OHHTTPStubs removeAllStubs];
    [ARSystemTime reset];
});

describe(@"not in sync", ^{
    it(@"returns NO", ^{
        expect(ARSystemTime.inSync).to.beFalsy();
    });

    it(@"returns current date/time", ^{
        NSInteger currentYear = [[NSCalendar currentCalendar] components:NSCalendarUnitYear fromDate:[NSDate date]].year;
        expect([[NSCalendar currentCalendar] components:NSCalendarUnitYear fromDate:[ARSystemTime date]].year).to.equal(currentYear);
    });
});

describe(@"in sync", ^{
    beforeEach(^{
        [ARSystemTime sync];
    });

    it(@"returns YES", ^{
        expect(ARSystemTime.inSync).will.beTruthy();
    });

    it(@"returns a date time in the future", ^{
        // the delta between now and 2422 will put [ARSystemTime date] into the future
        NSInteger currentYear = [[NSCalendar currentCalendar] components:NSCalendarUnitYear fromDate:[NSDate date]].year;
        expect([[NSCalendar currentCalendar] components:NSCalendarUnitYear fromDate:[ARSystemTime date]].year).will.beGreaterThan(currentYear);
    });

    it(@"returns a new date every time", ^{
        [ARSystemTime sync];
        NSDate *now = [ARSystemTime date];
        // eventually the new time will be ahead of the previous one
        expect(now).will.beLessThan([ARSystemTime date]);
    });
});


SpecEnd;
