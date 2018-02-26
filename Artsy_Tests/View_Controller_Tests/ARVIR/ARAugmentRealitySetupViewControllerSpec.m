#import "ARAugmentRealitySetupViewController.h"

SpecBegin(ARAugmentRealitySetupViewController);

it(@"preview view controller displays artwork",^{
    ARAugmentRealitySetupViewController *vc = [[ARAugmentRealitySetupViewController alloc] initWithMovieURL:nil];
    expect(vc).to.haveValidSnapshot();
});

SpecEnd;

