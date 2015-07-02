#import "ARFairPopupViewController.h"

SpecBegin(ARFairPopupViewController);

__block ARFairPopupViewController *sut;

describe(@"visuals", ^{
    it(@"looks right", ^{
        NSURL *imageURL = [[NSBundle bundleForClass:self.class] URLForResource:@"wide" withExtension:@"jpg"];
        sut = [[ARFairPopupViewController alloc] initWithFairTitle:@"Test Title" imageBackgroundURL:imageURL slug:@"slug"];
        expect(sut).to.haveValidSnapshot();
    });
});

SpecEnd
