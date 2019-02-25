#import "ARFairViewController.h"
#import "ARNavigationButtonsViewController.h"
#import "MTLModel+JSON.h"
#import "Fair.h"
#import "Profile.h"
#import "ARSearchFieldButton.h"
#import "ARFairSearchViewController.h"
#import "ARSearchViewController+Private.h"


@interface ARFairViewController (Testing)

@property (nonatomic, strong) ARSearchFieldButton *searchButton;
@property (nonatomic, strong) ARFairSearchViewController *searchVC;

@property (nonatomic, assign) BOOL hasMap;
@property (nonatomic, strong) ORStackScrollView *stackView;

@property (nonatomic, assign) BOOL displayingSearch;

@property (nonatomic, assign) BOOL hidesBackButton;

@property (nonatomic, strong) ARNavigationButtonsViewController *primaryNavigationVC;

- (void)searchFieldButtonWasPressed:(ARSearchFieldButton *)sender;
- (BOOL)hasSufficientDataForParallaxHeader;

@end


SpecBegin(ARFairViewController);

it(@"maps bindings correctly", ^{
    ARFairViewController *viewController = [[ARFairViewController alloc] initWithFair:nil];

    expect(viewController.displayingSearch).to.beFalsy();
    expect(viewController.hidesNavigationButtons).to.beFalsy();

    viewController.searchVC = [[ARFairSearchViewController alloc] initWithFair:nil];

    expect(viewController.displayingSearch).to.beTruthy();
    expect(viewController.hidesNavigationButtons).to.beTruthy();
});

__block Fair *bannerlessFair;
__block Fair *bannerFair;
__block Profile *bannerlessProfile;
__block Profile *bannerProfile;

before(^{
    bannerlessFair = [[Fair alloc] initWithFairID:@"a-fair-affair"];
    bannerFair = [Fair modelWithJSON:@{
        @"id" : @"fair-id",
        @"image_urls" : @{
            @"square" : @"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/square.jpg",
            @"large_rectangle" : @"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/large_rectangle",
            @"wide" : @"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/wide"
        }
    }];
    bannerlessProfile = [[Profile alloc] initWithProfileID:@"profile-id"];
    bannerProfile = [Profile modelWithJSON:@{
        @"id" : @"profile-id",
        @"default_image_version" : @"square",
        @"icon" : @{
            @"image_urls" : @{
                @"circle" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/circle.jpg",
                @"square" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.jpg"
            }
        }
    }];
});

describe(@"without enough information for a parallax header", ^{
    it(@"doesn't use a parallax header", ^{
        ARFairViewController *viewController = [[ARFairViewController alloc] initWithFair:bannerlessFair andProfile:bannerlessProfile];
        expect([viewController hasSufficientDataForParallaxHeader]).to.beFalsy();
    });
});
describe(@"with some information", ^{
    it(@"uses a parallax header", ^{
        ARFairViewController *viewController = [[ARFairViewController alloc] initWithFair:bannerFair andProfile:bannerlessProfile];
        expect([viewController hasSufficientDataForParallaxHeader]).to.beTruthy();
    });

    it(@"uses a parallax header", ^{
        ARFairViewController *viewController = [[ARFairViewController alloc] initWithFair:bannerlessFair andProfile:bannerProfile];
        expect([viewController hasSufficientDataForParallaxHeader]).to.beTruthy();
    });
});

describe(@"with all available information", ^{
    it(@"uses a parallax header", ^{
        ARFairViewController *viewController = [[ARFairViewController alloc] initWithFair:bannerFair andProfile:bannerProfile];
        expect([viewController hasSufficientDataForParallaxHeader]).to.beTruthy();
    });
});

context(@"with no map", ^{
    __block ARFairViewController *fairVC = nil;

    beforeEach(^{
        Fair *fair = [Fair modelWithJSON:@{
            @"id" : @"a-fair-affair",
            @"name" : @"The Fair Affair",
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];

        ARStubbedFairNetworkModel *networkModel = [[ARStubbedFairNetworkModel alloc] init];
        networkModel.maps = @[];
        OrderedSet *set = [OrderedSet modelWithJSON: @{
            @"description": @"",
            @"display_on_mobile": @(1),
            @"id": @"set-id",
            @"internal_name": @"The Armory Show 2014 Primary Features",
            @"item_type": @"FeaturedLink",
            @"key": @"primary",
            @"name": @"The Armory Show 2014 Primary Features",
            @"published": @(1),
        }];

        networkModel.orderedSets =  @[set];

        fair.networkModel = networkModel;

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/set-id/items" withResponse:@[
            @{ @"id": @"one", @"href": @"/post/moby-my-highlights-from-art-los-angeles-contemporary", @"title" : @"Moby" },
        ]];

        fairVC = [[ARFairViewController alloc] initWithFair:fair];
        fairVC.animatesSearchBehavior = NO;
    });

    afterEach(^{
        [OHHTTPStubs removeAllStubs];
    });

    context(@"without a profile", ^{
        it(@"sets fair title and dates", ^{
            expect(fairVC.view.subviews.count).will.equal(2);
            expect(fairVC.stackView).to.beKindOf(ORStackScrollView.class);

            expect(fairVC.fair.name).will.equal(@"The Fair Affair");

            ORStackView *stackView = ((ORStackScrollView *) fairVC.stackView).stackView;
            expect(stackView.subviews.count).will.beGreaterThan(0);

            UIView *titleView = stackView.subviews[0];
            expect(titleView).to.beKindOf([UILabel class]);
            expect(((UILabel *) titleView).text).to.equal(@"The Fair Affair");

            UIView *subtitleView = stackView.subviews[1];
            expect(subtitleView).to.beKindOf([UILabel class]);
            expect(((UILabel *) subtitleView).text).to.equal(@"Jan 30th - Feb 2nd, 1976");
        });
    });

    context(@"view is loaded", ^{
        beforeEach(^{
            expect(fairVC.view).toNot.beNil();
        });

        it(@"has no map", ^{
            expect(fairVC.hasMap).will.beFalsy();
        });
    });
});

context(@"with a map", ^{
    __block ARFairViewController *fairVC = nil;

    beforeEach(^{
        Fair *fair = [Fair modelWithJSON:@{
            @"id" : @"a-fair-affair",
            @"name" : @"The Fair Affair",
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];

        ARStubbedFairNetworkModel *networkModel = [[ARStubbedFairNetworkModel alloc] init];
        networkModel.maps = @[[Map modelWithJSON:@{@"id": @"map-id"}]];
        OrderedSet *set = [OrderedSet modelWithJSON: @{
            @"description": @"",
            @"display_on_mobile": @(1),
            @"id": @"set-id",
            @"internal_name": @"The Armory Show 2014 Primary Features",
            @"item_type": @"FeaturedLink",
            @"key": @"primary",
            @"name": @"The Armory Show 2014 Primary Features",
            @"published": @(1),
        }];

        networkModel.orderedSets = @[set];
        
        fair.networkModel = networkModel;
        
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/set-id/items" withResponse:@[
            @{ @"id": @"one", @"href": @"/post/moby-my-highlights-from-art-los-angeles-contemporary", @"title" : @"Moby" },
        ]];

        fairVC = [[ARFairViewController alloc] initWithFair:fair];
        fairVC.animatesSearchBehavior = NO;
        fairVC.view.frame = [[UIScreen mainScreen] bounds];
        
    });
    
    afterEach(^{
        [OHHTTPStubs removeAllStubs];
    });
    
    it(@"has a map", ^{
        expect(fairVC.hasMap).will.beTruthy();
    });
    
    it(@"has a map button", ^{
        expect(fairVC.primaryNavigationVC).willNot.beNil();
        expect(fairVC.primaryNavigationVC.buttonDescriptions.count).will.beGreaterThan(0);
        expect([fairVC.primaryNavigationVC.buttonDescriptions detect:^BOOL(NSDictionary *button) {
            return [button[@"ARNavigationButtonPropertiesKey"][@"title"] isEqualToString:@"Map"];
        }]).willNot.beNil();
    });
    
    it(@"search view looks correct", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id" withResponse:@{@"id" : @"a-fair-affair"}];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id/shows" withResponse:@{}];
        [fairVC searchFieldButtonWasPressed:nil];
        [fairVC.searchVC beginAppearanceTransition:YES animated:NO];
        [fairVC.searchVC endAppearanceTransition];
        expect(fairVC.view).to.haveValidSnapshot();
    });
});

it(@"creates an NSUserActivity", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/set-id/items" withResponse:@{}];
    Fair *fair = [Fair modelWithJSON:@{
        @"id" : @"a-fair-affair",
        @"name" : @"The Fair Affair",
        @"start_at" : @"1976-01-30T15:00:00+00:00",
        @"end_at" : @"1976-02-02T15:00:00+00:00"
    }];
    
    ARStubbedFairNetworkModel *networkModel = [[ARStubbedFairNetworkModel alloc] init];
    networkModel.maps = @[[Map modelWithJSON:@{@"id": @"map-id"}]];
    OrderedSet *set = [OrderedSet modelWithJSON: @{
        @"description": @"",
        @"display_on_mobile": @(1),
        @"id": @"set-id",
        @"internal_name": @"The Armory Show 2014 Primary Features",
        @"item_type": @"FeaturedLink",
        @"key": @"primary",
        @"name": @"The Armory Show 2014 Primary Features",
        @"published": @(1),
    }];
    
    networkModel.orderedSets = @[set];
    fair.networkModel = networkModel;
    
    ARFairViewController *vc = [[ARFairViewController alloc] initWithFair:fair];
    vc.view.frame = [[UIScreen mainScreen] bounds];
    [vc viewDidAppear:NO];

    expect(vc.userActivity).notTo.beNil();
    expect(vc.userActivity.title).to.equal(@"The Fair Affair");
});


SpecEnd;
