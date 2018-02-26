@import Forgeries;

#import "ARDefaults.h"
#import "ARAugmentRealitySetupViewController.h"

@interface ARAugmentRealitySetupViewController ()
@property (nonatomic, copy) NSUserDefaults *defaults;

- (void)back;
@end


SpecBegin(ARAugmentRealitySetupViewController);

ForgeriesUserDefaults *completedDefaults = [ForgeriesUserDefaults defaults:@{
    ARAugmentedRealityCameraAccessGiven: @(YES),
    ARAugmentedRealityHasSuccessfullyRan: @(YES)
}];

ForgeriesUserDefaults *untouchedDefaults = [ForgeriesUserDefaults defaults:@{
    ARAugmentedRealityCameraAccessGiven: @(NO),
    ARAugmentedRealityHasSuccessfullyRan: @(NO)
}];

ForgeriesUserDefaults *deniedDefaults = [ForgeriesUserDefaults defaults:@{
    ARAugmentedRealityCameraAccessGiven: @(NO),
    ARAugmentedRealityHasSuccessfullyRan: @(YES)
}];

it(@"defaults to asking for camera access",^{
    ARAugmentRealitySetupViewController *vc = [[ARAugmentRealitySetupViewController alloc] initWithMovieURL:nil config:nil];
    vc.defaults = (id)untouchedDefaults;

    expect(vc).to.haveValidSnapshot();
});

it(@"has different settings when denied access",^{
    ARAugmentRealitySetupViewController *vc = [[ARAugmentRealitySetupViewController alloc] initWithMovieURL:nil config:nil];
    vc.defaults = (id)deniedDefaults;
    expect(vc).to.haveValidSnapshot();
});


describe(@"canSkipARSetup", ^{
    it(@"returns true with the right defaults",^{
        expect([ARAugmentRealitySetupViewController canSkipARSetup:(id)completedDefaults]).to.beTruthy();
    });

    it(@"returns false with incomplete defaults",^{
        expect([ARAugmentRealitySetupViewController canSkipARSetup:(id)deniedDefaults]).to.beFalsy();
    });
});


describe(@"canOpenARView", ^{
    it(@"returns false, because tests run on iOS 10",^{
        expect([ARAugmentRealitySetupViewController canOpenARView]).to.beFalsy();
    });
});


describe(@"back", ^{
    it(@"calls pop",^{
//        id navMock = [OCMockObject observerMock];
//        [[navMock stub] popViewControllerAnimated:NO];
//
//        ARAugmentRealitySetupViewController *vc = [[ARAugmentRealitySetupViewController alloc] initWithMovieURL:nil config:nil];
//        [vc back];
//        [navMock verify];
    });
});

SpecEnd;

