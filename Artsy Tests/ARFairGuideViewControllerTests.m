#import "ARFairAwareObject.h"
#import "ARFairGuideViewController.h"
#import "ARSwitchBoard.h"

@interface ARFairGuideViewController (Testing)

- (void)userDidSignUp;
@property (nonatomic, assign) NSInteger selectedTabIndex;
@property (nonatomic, strong) User *currentUser;
@end

SpecBegin(ARFairGuideViewController)

__block ARFairGuideViewController *_fairGuideVC = nil;

beforeEach(^{
    Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
    _fairGuideVC = [[ARFairGuideViewController alloc] initWithFair:fair];
});

it(@"looks correct with a logged in user", ^{
    _fairGuideVC.currentUser = [User modelWithJSON:@{ @"name" : @"User Name"}];
    _fairGuideVC.view.frame = CGRectMake(0, 0, 320, 480);
    [_fairGuideVC fairDidLoad];
    expect(_fairGuideVC).to.haveValidSnapshot();
});

it(@"looks correct with a trial user", ^{
    _fairGuideVC.currentUser = (id)[NSNull null];
    _fairGuideVC.view.frame = CGRectMake(0, 0, 320, 480);
    [_fairGuideVC fairDidLoad];
    expect(_fairGuideVC).to.haveValidSnapshot();
});

it(@"adds a top border", ^{
    _fairGuideVC.currentUser = [User modelWithJSON:@{ @"name" : @"User Name"}];
    _fairGuideVC.view.frame = CGRectMake(0, 0, 320, 480);
    _fairGuideVC.showTopBorder = YES;
    [_fairGuideVC fairDidLoad];
    expect(_fairGuideVC).to.haveValidSnapshot();
});

it(@"calls the appropriate delegate method upon user change", ^{
    id delegateMock = [OCMockObject mockForProtocol:@protocol(ARFairGuideViewControllerDelegate)];
    [[delegateMock expect] fairGuideViewControllerDidChangeUser:OCMOCK_ANY];
    
    [_fairGuideVC userDidSignUp];
    expect(_fairGuideVC.selectedTabIndex).to.equal(-1);
});

SpecEnd
