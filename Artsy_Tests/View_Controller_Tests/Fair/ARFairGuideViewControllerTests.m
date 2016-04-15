#import "ARFairAwareObject.h"
#import "ARFairGuideViewController.h"
#import "ARSwitchBoard.h"
#import "ARSwitchboard+Eigen.h"


@interface ARFairGuideViewController (Testing)

- (void)userDidLoginOrSignUp;
@property (nonatomic, assign) NSInteger selectedTabIndex;
@property (nonatomic, strong) User *currentUser;
@end

SpecBegin(ARFairGuideViewController);

__block ARFairGuideViewController *fairGuideVC = nil;

beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/profiles" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/artists" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id/shows" withResponse:@{}];

    Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
    fairGuideVC = [[ARFairGuideViewController alloc] initWithFair:fair];
});

it(@"looks correct with a logged in user", ^{
    fairGuideVC.currentUser = [User modelWithJSON:@{ @"name" : @"User Name"}];
    fairGuideVC.view.frame = CGRectMake(0, 0, 320, 480);
    [fairGuideVC fairDidLoad];
    expect(fairGuideVC).to.haveValidSnapshot();
});

it(@"looks correct with a trial user", ^{
    fairGuideVC.currentUser = (id)[NSNull null];
    fairGuideVC.view.frame = CGRectMake(0, 0, 320, 480);
    [fairGuideVC fairDidLoad];
    expect(fairGuideVC).to.haveValidSnapshot();
});

it(@"adds a top border", ^{
    fairGuideVC.currentUser = [User modelWithJSON:@{ @"name" : @"User Name"}];
    fairGuideVC.view.frame = CGRectMake(0, 0, 320, 480);
    fairGuideVC.showTopBorder = YES;
    [fairGuideVC fairDidLoad];
    expect(fairGuideVC).to.haveValidSnapshot();
});

it(@"calls the appropriate delegate method upon user change", ^{
    id delegateMock = [OCMockObject mockForProtocol:@protocol(ARFairGuideViewControllerDelegate)];
    [[delegateMock expect] fairGuideViewControllerDidChangeUser:OCMOCK_ANY];
    
    [fairGuideVC userDidLoginOrSignUp];
    expect(fairGuideVC.selectedTabIndex).to.equal(-1);
});

SpecEnd;
