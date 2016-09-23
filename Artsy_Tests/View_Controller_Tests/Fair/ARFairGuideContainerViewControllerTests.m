#import "ARFairGuideContainerViewController.h"
#import "ARFairGuideViewController.h"


@interface ARFairGuideContainerViewController (Testing) <ARFairGuideViewControllerDelegate>

- (void)didReceiveTap:(UITapGestureRecognizer *)recognizer;

@property (nonatomic, assign) BOOL mapsLoaded;
@property (nonatomic, assign) BOOL fairLoaded;

@property (nonatomic, strong) ARFairGuideViewController *fairGuideViewController;

- (void)downloadContent;

@end

SpecBegin(ARFairGuideContainerViewController);

__block ARFairGuideContainerViewController *_fairGuideVC = nil;

beforeEach(^{
    Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
    ARStubbedFairNetworkModel *model = [[ARStubbedFairNetworkModel alloc] init];
    model.showFeedItems = @[];
    fair.networkModel = model;

    id mockFair = [OCMockObject partialMockForObject:fair];
    
    NSArray *maps = @[[Map modelWithJSON: @{
    @"map_features": @[
        @{
            @"feature_type": @"lounge",
            @"name": @"Public Lounge",
            @"x": @0.8,
            @"y": @0.7
        },
        @{
            @"feature_type": @"bar",
            @"name": @"VIP Bar",
            @"x": @0.8,
            @"y": @0.8
    }],
    @"id": @"map-one",
    @"max_tiled_height": @(1000),
    @"max_tiled_width": @(2000)
    }]];
    
    [[[mockFair stub] andReturn:maps] maps];
    [(Fair *)[mockFair stub] updateFair:[OCMArg checkWithBlock:^BOOL(void (^block)(void)) {
        if (block) {
            block();
        }
        
        return YES;
    }]];
    
    [[[mockFair stub] andReturn:maps] maps];
    [(Fair *)[mockFair stub] getFairMaps:[OCMArg checkWithBlock:^BOOL(void (^block)(NSArray *)) {
        if (block) {
            block(maps);
        }
        
        return YES;
    }]];
    
    _fairGuideVC = [[ARFairGuideContainerViewController alloc] initWithFair:mockFair];
    _fairGuideVC.animatedTransitions = NO;
});

it(@"has the correct fair", ^{
    expect(_fairGuideVC.fair.fairID).to.equal(@"fair-id");
});

describe(@"a loaded view controller", ^{
    beforeEach(^{
        __unused UIView *view = _fairGuideVC.view;
    });
    
    describe(@"that has appeared", ^{
        
        pending(@"after uncollapsing map, it has a valid snapshot", ^{ // TODO: fix this
            [_fairGuideVC didReceiveTap:nil];
            expect(_fairGuideVC).to.haveValidSnapshot();
        });
    });
});

it(@"handles a changed user correct", ^{
    __unused UIView *view = _fairGuideVC.view;
    [_fairGuideVC beginAppearanceTransition:YES animated:NO];
    [_fairGuideVC endAppearanceTransition];

    expect(_fairGuideVC.mapsLoaded).to.beTruthy();
    expect(_fairGuideVC.fairLoaded).to.beTruthy();
    
    id fairGuideMock = [OCMockObject partialMockForObject:_fairGuideVC];
    [[fairGuideMock expect] downloadContent];
    
    [fairGuideMock fairGuideViewControllerDidChangeUser:_fairGuideVC.fairGuideViewController];
    
    expect(_fairGuideVC.mapsLoaded).to.beFalsy();
    expect(_fairGuideVC.fairLoaded).to.beFalsy();
    
    [fairGuideMock verify];
});

SpecEnd;
