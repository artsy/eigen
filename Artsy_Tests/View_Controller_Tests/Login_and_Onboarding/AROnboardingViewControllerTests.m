#import "AROnboardingViewController.h"


@interface AROnboardingViewController (Test)

- (void)presentCollectorLevel;
- (void)presentWebOnboarding;
- (void)presentOnboarding;

@end

SpecBegin(AROnboardingViewController);

// commenting this out for now
// because we no longer will have web onboarding nor do we have the collector level question
// I want to redo this once the sequence is correct

// TODO: implement new onboarding signup sequence

//__block OCMockObject *mock;
//__block AROnboardingViewController *vc;
//
//describe(@"signup splash", ^{
//    describe(@"signupDone", ^{
//
//        before(^{
//            vc = [[AROnboardingViewController alloc] init];
//            mock = [OCMockObject partialMockForObject:vc];
//        });
//
//        after(^{
//            [mock stopMocking];
//            [ARTestContext stopStubbing];
//        });
//
//        it(@"ipad", ^{
//            [ARTestContext stubDevice:ARDeviceTypePad];
//            [[mock reject] presentCollectorLevel];
//            [[mock expect] presentWebOnboarding];
//            [vc didSignUpAndLogin];
//            [mock verify];
//        });
//
//        it (@"not ipad", ^{
//            [ARTestContext stubDevice:ARDeviceTypePhone5];
//            [[mock reject] presentWebOnboarding];
//            [[mock expect] presentCollectorLevel];
//            [vc didSignUpAndLogin];
//            [mock verify];
//        });
//
//        describe(@"when registering to bid", ^{
//            it(@"does not onboard on iPhone", ^{
//                [ARTestContext stubDevice:ARDeviceTypePhone5];
//                vc.trialContext = ARTrialContextAuctionBid;
//                [[mock reject] presentOnboarding];
//                [[mock expect] dismissOnboardingWithVoidAnimation:YES];
//                [vc didSignUpAndLogin];
//                [mock verify];
//            });
//        });
//    });
//});

SpecEnd;
