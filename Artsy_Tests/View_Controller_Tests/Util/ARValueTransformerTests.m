#import "ARValueTransformer.h"

SpecBegin(ARValueTransformerSpec);

typedef NS_ENUM(NSInteger, TestFeatureType) {
    TestFeatureOne,
    TestFeatureTwo,
    TestFeatureThree
};

NSDictionary *featureTypes = @{
    @"one" : @(TestFeatureOne),
    @"two" : @(TestFeatureTwo),
    @"three" : @(TestFeatureThree)
};

__block MTLValueTransformer *transformer = nil;

describe(@"without default", ^{
    beforeEach(^{
        transformer = [ARValueTransformer enumValueTransformerWithMap:featureTypes];
    });
    it(@"transforms a known value", ^{
        expect([transformer transformedValue:@"one"]).to.equal(TestFeatureOne);
    });
    it(@"returns nil for an unknown value", ^{
        expect([transformer transformedValue:@"unknown"]).to.beNil;
    });
    it(@"returns nil for nil", ^{
        expect([transformer transformedValue:nil]).to.beNil;
    });
});

SpecEnd;
