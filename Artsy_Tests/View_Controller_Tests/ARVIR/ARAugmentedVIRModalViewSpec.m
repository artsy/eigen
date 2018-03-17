#import "ARAugmentedVIRModalView.h"

SpecBegin(ARAugmentedVIRModalView);

it(@"looks right",^{
    ARAugmentedVIRModalView *vc = [[ARAugmentedVIRModalView alloc] initWithTitle:@"We’re having trouble finding your wall. Make sure the room is well-lit or try focusing on a different object on the wall." delegate:nil];
    vc.frame = CGRectMake(0, 0, 375, 812);
    expect(vc).to.haveValidSnapshot();
});

SpecEnd;


