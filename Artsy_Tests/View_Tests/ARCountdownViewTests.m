#import "ARCountdownView.h"

SpecBegin(ARCountdownView);

it(@"looks ok by default", ^{
    ARCountdownView *subject = [[ARCountdownView alloc] init];
    subject.targetDate = [NSDate distantPast];

    [subject startTimer];

    expect(subject).to.haveValidSnapshot();
});

it(@"looks ok when configured with a custom colour", ^{
    ARCountdownView *subject = [[ARCountdownView alloc] initWithColor:UIColor.redColor];
    subject.targetDate = [NSDate distantPast];

    [subject startTimer];

    expect(subject).to.haveValidSnapshot();

});

it(@"looks ok on a regular size class", ^{
    ARCountdownView *subject = [[ARCountdownView alloc] init];
    subject.targetDate = [NSDate distantPast];
    // Need to trick it into thinking its on an iPad
    id partialMock = [OCMockObject partialMockForObject:subject];
    [[[partialMock stub] andReturn:[UITraitCollection traitCollectionWithHorizontalSizeClass:UIUserInterfaceSizeClassRegular]] traitCollection];
    [subject traitCollectionDidChange:nil];

    [subject startTimer];

    expect(subject).to.haveValidSnapshot();

});

it(@"looks good with a header", ^{
    ARCountdownView *subject = [[ARCountdownView alloc] init];
    subject.targetDate = [NSDate distantPast];
    subject.heading = @"Closing in";

    [subject startTimer];

    expect(subject).to.haveValidSnapshot();

});

SpecEnd
