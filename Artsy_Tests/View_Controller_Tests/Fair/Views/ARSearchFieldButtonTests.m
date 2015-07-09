#import "ARSearchFieldButton.h"

SpecBegin(ARSearchFieldButton);

it(@"has a valid snapshot", ^{
    ARSearchFieldButton *button = [[ARSearchFieldButton alloc] initWithFrame:CGRectMake(0, 0, 280, 44)];
    expect(button).to.haveValidSnapshot();
});

SpecEnd
