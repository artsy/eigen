#import "ARSwitchView.h"

SpecBegin(ARSwitchView);

__block NSArray *titles;

it(@"looks correct configured with two buttons", ^{
    titles = @[@"First title", @"Second Title"];

    ARSwitchView *switchView = [[ARSwitchView alloc] initWithButtonTitles:titles];
    switchView.frame = (CGRect){.origin = CGPointZero, .size = CGSizeMake(280, switchView.intrinsicContentSize.height)};

    [switchView snapshotViewAfterScreenUpdates:YES];
    expect(switchView).to.haveValidSnapshot();
});

it(@"accepts any number of items", ^{
    NSArray *titles = @[@"First title", @"Second Title", @"Third Title", @"Forth Title"];

    ARSwitchView *switchView = [[ARSwitchView alloc] initWithButtonTitles:titles];
    switchView.frame = (CGRect){.origin = CGPointZero, .size = CGSizeMake(280, switchView.intrinsicContentSize.height)};

    [switchView snapshotViewAfterScreenUpdates:YES];
    expect(switchView).to.haveValidSnapshot();
});

it(@"adjusts buttons to any switch width", ^{
    NSArray *titles = @[@"First title", @"Second Title", @"Third Title", @"Forth Title"];

    ARSwitchView *switchView = [[ARSwitchView alloc] initWithButtonTitles:titles];
    switchView.frame = (CGRect){.origin = CGPointZero, .size = CGSizeMake(728, switchView.intrinsicContentSize.height)};

    [switchView snapshotViewAfterScreenUpdates:YES];
    expect(switchView).to.haveValidSnapshot();
});

SpecEnd
