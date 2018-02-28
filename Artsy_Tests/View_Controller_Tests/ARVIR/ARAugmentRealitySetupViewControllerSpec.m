@import Forgeries;

#import "ARDefaults.h"
#import "ARAugmentedVIRSetupViewController.h"

@interface ARAugmentedVIRSetupViewController ()
@property (nonatomic, copy) NSUserDefaults *defaults;

- (void)back;
@end


SpecBegin(ARAugmentRealitySetupViewController);



ForgeriesUserDefaults *untouchedDefaults = [ForgeriesUserDefaults defaults:@{
    ARAugmentedRealityCameraAccessGiven: @(NO),
    ARAugmentedRealityHasSeenSetup: @(NO),
    ARAugmentedRealityHasSuccessfullyRan: @(NO)
}];

ForgeriesUserDefaults *deniedDefaults = [ForgeriesUserDefaults defaults:@{
    ARAugmentedRealityCameraAccessGiven: @(NO),
    ARAugmentedRealityHasSeenSetup: @(YES),
    ARAugmentedRealityHasSuccessfullyRan: @(YES)
}];

ForgeriesUserDefaults *completedDefaults = [ForgeriesUserDefaults defaults:@{
    ARAugmentedRealityCameraAccessGiven: @(YES),
    ARAugmentedRealityHasSeenSetup: @(YES),
    ARAugmentedRealityHasSuccessfullyRan: @(YES)
}];

it(@"defaults to asking for camera access",^{
    ARAugmentedVIRSetupViewController *vc = [[ARAugmentedVIRSetupViewController alloc] initWithMovieURL:nil config:nil];
    vc.defaults = (id)untouchedDefaults;

    expect(vc).to.haveValidSnapshot();
});

it(@"viewWillAppear sets ARAugmentedRealityHasSeenSetup",^{
    ForgeriesUserDefaults *defaults = [ForgeriesUserDefaults defaults:@{
      ARAugmentedRealityHasSeenSetup: @(NO)
    }];

    ARAugmentedVIRSetupViewController *vc = [[ARAugmentedVIRSetupViewController alloc] initWithMovieURL:nil config:nil];
    vc.defaults = (id)defaults;
    [vc viewWillAppear:NO];

    expect([defaults boolForKey:ARAugmentedRealityHasSeenSetup]).to.beTruthy();
});


it(@"has different settings when denied access",^{
    ARAugmentedVIRSetupViewController *vc = [[ARAugmentedVIRSetupViewController alloc] initWithMovieURL:nil config:nil];
    vc.defaults = (id)deniedDefaults;
    expect(vc).to.haveValidSnapshot();
});


describe(@"canSkipARSetup", ^{
    it(@"returns true with the right defaults",^{
        expect([ARAugmentedVIRSetupViewController canSkipARSetup:(id)completedDefaults]).to.beTruthy();
    });

    it(@"returns false with incomplete defaults",^{
        expect([ARAugmentedVIRSetupViewController canSkipARSetup:(id)deniedDefaults]).to.beFalsy();
    });
});


describe(@"canOpenARView", ^{
    it(@"returns false, because tests run on iOS 10",^{
        expect([ARAugmentedVIRSetupViewController canOpenARView]).to.beFalsy();
    });
});


describe(@"back", ^{
    it(@"calls pop",^{
        id navMock = [OCMockObject mockForClass:[UINavigationController class]];
        [[navMock stub] popViewControllerAnimated:NO];

        ARAugmentedVIRSetupViewController *vc = [[ARAugmentedVIRSetupViewController alloc] initWithMovieURL:nil config:nil];
        [vc back];
        [navMock verify];
    });
});

SpecEnd;

