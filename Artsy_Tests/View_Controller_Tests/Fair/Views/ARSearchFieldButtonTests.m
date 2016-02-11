#import "ARSearchFieldButton.h"

SpecBegin(ARSearchFieldButton);

it(@"has a valid snapshot", ^{
    ARSearchFieldButton *button = [[ARSearchFieldButton alloc] initWithFrame:CGRectMake(0, 0, 280, 44)];
    expect(button).to.haveValidSnapshot();
});

it(@"adds a gesture recogniser when a delegate is set", ^{
    ARSearchFieldButton *button = [[ARSearchFieldButton alloc] initWithFrame:CGRectMake(0, 0, 280, 44)];
    // starts out nil
    expect(button.gestureRecognizers).to.beFalsy();

    id <ARSearchFieldButtonDelegate> object = (id)[[NSObject alloc] init];
    [button setDelegate:object];
    expect(button.gestureRecognizers).to.haveCountOf(1);
});

SpecEnd;
