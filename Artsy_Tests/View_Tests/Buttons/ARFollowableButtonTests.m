#import <XCTest/XCTest.h>
#import "ARFollowableButton.h"

SpecBegin(ARFollowableButton);

describe(@"ARFollowableButton", ^{
    it(@"following", ^{
        ARFollowableButton *button = [[ARFollowableButton alloc] initWithFrame:CGRectMake(0, 0, 300, 46)];
        [button setFollowingStatus:YES];
        expect(button).to.haveValidSnapshot();
    });

    it(@"not following", ^{
        ARFollowableButton *button = [[ARFollowableButton alloc] initWithFrame:CGRectMake(0, 0, 300, 46)];
        [button setFollowingStatus:NO];
        expect(button).to.haveValidSnapshot();
    });
});

SpecEnd;
