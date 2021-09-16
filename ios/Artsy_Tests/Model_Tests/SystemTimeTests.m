SpecBegin(SystemTime);

__block SystemTime *systemTime;

beforeEach(^{
    systemTime = [SystemTime modelWithJSON:@{
        @"time": @"2022-03-24T13:29:34Z",
        @"day": @(24),
        @"wday": @(4),
        @"month": @(3),
        @"year": @(2022),
        @"hour": @(13),
        @"min": @(29),
        @"sec": @(34),
        @"dst": @(NO),
        @"unix": @(1395926974),
        @"utc_offset": @(0),
        @"zone": @"UTC",
        @"iso8601": @"2022-03-24T13:29:34Z"
    }];
});

it(@"converts date", ^{
    NSDateComponents *components = [[NSCalendar currentCalendar] components:NSCalendarUnitDay | NSCalendarUnitMonth | NSCalendarUnitYear fromDate:systemTime.date];
    expect(components.year).to.equal(2022);
    expect(components.month).to.equal(3);
    expect(components.day).to.equal(24);
});

SpecEnd;
