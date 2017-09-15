#import "OrNil.h"

SpecBegin(OrNil)

it(@"returns self for objects", ^{
    NSObject *instance = [NSObject new];
    expect(instance.orNil).to.equal(instance);
});

it(@"returns nil for NSNull", ^{
    NSNull *instance = [NSNull null];
    expect(instance.orNil).to.equal(nil);
});

SpecEnd
