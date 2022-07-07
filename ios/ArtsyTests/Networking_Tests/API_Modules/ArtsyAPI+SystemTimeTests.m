#import "ArtsyAPI.h"
#import "ArtsyAPI+SystemTime.h"
#import "ARNetworkConstants.h"

SpecBegin(ArtsyAPISystemTime);

beforeEach(^{
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
});

it(@"retrieves system time", ^{
    waitUntil(^(DoneCallback done) {
        [ArtsyAPI getSystemTime:^(SystemTime *systemTime) {
            expect(systemTime).toNot.beNil();
            NSDateComponents *components = [[NSCalendar currentCalendar] components:NSCalendarUnitDay | NSCalendarUnitMonth | NSCalendarUnitYear fromDate:systemTime.date];
            expect(components.year).to.equal(2422);
            expect(components.month).to.equal(3);
            expect(components.day).to.equal(24);
            done();
        } failure:nil];
    });
});

SpecEnd;
