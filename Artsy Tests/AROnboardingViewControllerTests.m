#import "AROnboardingViewController.h"

@interface AROnboardingViewController (Test)

- (void)presentCollectorLevel;
- (void)presentWebOnboarding;

@end

SpecBegin(AROnboardingViewController)

__block OCMockObject *mock;
__block AROnboardingViewController *vc;

describe(@"signup splash", ^{
    describe(@"signupDone", ^{

        before(^{
            vc = [[AROnboardingViewController alloc] init];
            mock = [OCMockObject partialMockForObject:vc];
        });

        after(^{
            [mock stopMocking];
            [ARTestContext stopStubbing];
        });

        it(@"ipad", ^{
            [ARTestContext stubDevice:ARDeviceTypePad];
            [[mock reject] presentCollectorLevel];
            [[mock expect] presentWebOnboarding];
            [vc signupDone];
            [mock verify];
        });

        it (@"not ipad", ^{
            [ARTestContext stubDevice:ARDeviceTypePhone5];
            [[mock reject] presentWebOnboarding];
            [[mock expect] presentCollectorLevel];
            [vc signupDone];
            [mock verify];
        });
    });
});

SpecEnd
