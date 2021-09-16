#import "NSDate+DateRange.h"

SpecBegin(NSDateRange);

it(@"ordinals correctly", ^{
    expect([NSDate ordinalForDay:22]).to.equal(@"nd");
    expect([NSDate ordinalForDay:2]).to.equal(@"nd");
    expect([NSDate ordinalForDay:14]).to.equal(@"th");
    expect([NSDate ordinalForDay:1]).to.equal(@"st");
    expect([NSDate ordinalForDay:11]).to.equal(@"th");
});

SpecEnd;
