
#import "UIApplicationStateEnum.h"

SpecBegin(UIApplicationStateEnum);

describe(@"toString", ^{
    it(@"background", ^{
        expect([UIApplicationStateEnum toString:UIApplicationStateBackground]).to.equal(@"background");
    });

    it(@"active", ^{
        expect([UIApplicationStateEnum toString:UIApplicationStateActive]).to.equal(@"active");
    });

    it(@"inactive", ^{
        expect([UIApplicationStateEnum toString:UIApplicationStateInactive]).to.equal(@"inactive");
    });

    it(@"invalid", ^{
        expect(^{
            [UIApplicationStateEnum toString:(UIApplicationState) -1];
        }).to.raiseWithReason(@"NSGenericException", @"Unexpected UIApplicationState -1");
    });
});

SpecEnd;
