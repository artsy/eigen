#import "ARProfileViewController.h"
#import "ArtsyAPI.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "UIViewController+SimpleChildren.h"
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <Emission/ARFairComponentViewController.h>
#import "ARInternalMobileWebViewController.h"


@interface ARProfileViewControllerTestsConcreteLayoutGuide : NSObject <UILayoutSupport>
@property (nonatomic, assign) CGFloat length;
@property (atomic, strong) NSLayoutYAxisAnchor *topAnchor;
@property (atomic, strong) NSLayoutYAxisAnchor *bottomAnchor;
@property (atomic, strong) NSLayoutDimension *heightAnchor;
@end

@implementation ARProfileViewControllerTestsConcreteLayoutGuide
@end


@interface ARProfileViewController (Private)

- (void)loadProfile;
- (void)loadMartsyView;
- (void)showViewController:(UIViewController *)viewController;

@end

SpecBegin(ARProfileViewController);

NSString *profileID = @"id";

describe(@"initializer", ^{
    it(@"initializes with the correct profile ID", ^{
        ARProfileViewController *viewController = [[ARProfileViewController alloc] initWithProfileID:profileID];
        
        expect(viewController.profileID).to.equal(profileID);
    });
});

describe(@"viewDidLoad", ^{
    __block ARProfileViewController *viewController;
    
    beforeEach(^{
        viewController = [[ARProfileViewController alloc] initWithProfileID:profileID];
    });
    
    it(@"Sets up viewDidAppear: to call loadProfile", ^{
        id mockViewController = [OCMockObject partialMockForObject:viewController];
        [[mockViewController expect] loadProfile];
        [viewController viewDidLoad];
        [viewController viewWillAppear:NO];
        [mockViewController verify];
    });
    
    it(@"Only calls loadProfile the first time viewDidAppear: is called", ^{
        id mockViewController = [OCMockObject partialMockForObject:viewController];
        [[mockViewController expect] loadProfile];
        [viewController viewDidLoad];
        [viewController viewWillAppear:NO];
        [viewController viewWillAppear:NO];
        [mockViewController verify];
    });
});

describe(@"loadProfile", ^{
    __block ARProfileViewController *viewController;
    
    beforeEach(^{
        viewController = [[ARProfileViewController alloc] initWithProfileID:profileID];
    });
    
    it(@"calls getProfileForProfileID:", ^{
        id apiMock = [OCMockObject mockForClass:[ArtsyAPI class]];
        
        [[apiMock expect] getProfileForProfileID:profileID success:OCMOCK_ANY failure:OCMOCK_ANY];
        
        [viewController loadProfile];
        
        [apiMock verify];
        [apiMock stopMocking];
    });

    context(@"fair", ^{
        __block id apiMock;
        __block id viewControllerMock;

        before(^{
            apiMock = [OCMockObject mockForClass:[ArtsyAPI class]];
            viewControllerMock = [OCMockObject partialMockForObject:viewController];
        });

        it(@"loads a fairvc on iphone with a fair organizer", ^{
            [ARTestContext stubDevice:ARDeviceTypePhone5];
            [[viewControllerMock reject] showViewController:[OCMArg checkForClass:[ARFairComponentViewController class]]];
            [[viewControllerMock expect] loadMartsyView];
            [[apiMock expect] getProfileForProfileID:profileID success:[OCMArg checkWithBlock:^BOOL(void (^obj)(Profile *profile)) {
                Profile *profile = [Profile modelWithJSON:@{
                    @"id" : @"profile-id",
                    @"owner_type" : @"FairOrganizer",
                    @"owner" : @{
                        @"id" : @"user-id",
                        @"default_fair_id" : @"default-fair-id"
                    }
                }];

                if (obj) {
                    obj(profile);
                }
                return YES;
            }] failure:OCMOCK_ANY];

            [viewController loadProfile];
            [viewControllerMock verify];
            
            [apiMock verify];
            [apiMock stopMocking];
            [ARTestContext stopStubbing];
        });

        it(@"loads a fairvc on iphone with a fair", ^{
            [ARTestContext stubDevice:ARDeviceTypePhone5];
            // Shows the web view
            [[viewControllerMock expect] loadMartsyView];
            // Removes the web view
            [[viewControllerMock expect] ar_removeChildViewController:OCMOCK_ANY];

            [[viewControllerMock expect] showViewController:[OCMArg checkForClass:[ARFairComponentViewController class]]];

            [[apiMock expect] getProfileForProfileID:profileID success:[OCMArg checkWithBlock:^BOOL(void (^obj)(Profile *profile)) {
                Profile *profile = [Profile modelWithJSON:@{
                    @"id" : @"profile-id",
                    @"owner_type" : @"Fair",
                    @"owner" : @{
                        @"id" : @"fair-id",
                    }
                }];

                if (obj) {
                    obj(profile);
                }
                return YES;
            }] failure:OCMOCK_ANY];
            
            [viewController loadProfile];
            [viewControllerMock verify];
            
            [apiMock verify];
            [apiMock stopMocking];
            [ARTestContext stopStubbing];
        });

        it(@"always loads martsy on ipad", ^{
            [ARTestContext stubDevice:ARDeviceTypePad];
            [[viewControllerMock reject] showViewController:[OCMArg checkForClass:[ARFairComponentViewController class]]];
            [[viewControllerMock expect] loadMartsyView];
            [[apiMock reject] getProfileForProfileID:profileID success:OCMOCK_ANY failure:OCMOCK_ANY];
            
            [viewController loadProfile];
            [viewControllerMock verify];
            
            [apiMock verify];
            [apiMock stopMocking];
            [ARTestContext stopStubbing];
        });
    });

    
    it(@"loads martsy when a profile's owner is anything but a fair or organizer", ^{
        id apiMock = [OCMockObject mockForClass:[ArtsyAPI class]];
        
        id viewControllerMock = [OCMockObject partialMockForObject:viewController];
        [[viewControllerMock expect] loadMartsyView];
        
        [[apiMock expect] getProfileForProfileID:profileID success:[OCMArg checkWithBlock:^BOOL(void (^obj)(Profile *profile)) {
            Profile *profile = [Profile modelWithJSON:@{
                @"id" : @"profile-id",
                @"owner_type" : @"User",
                @"owner" : @{
                    @"id" : @"user-id",
                    @"type" : @"User"
                }
            }];

            if (obj) {
                obj(profile);
            }
            return YES;
        }] failure:OCMOCK_ANY];
        
        [viewController loadProfile];
        
        [viewControllerMock verify];
        
        [apiMock verify];
        [apiMock stopMocking];
    });
});

describe(@"loadMartsyView", ^{
    __block ARProfileViewController *viewController;
    
    beforeEach(^{
        viewController = [[ARProfileViewController alloc] initWithProfileID:profileID];
    });
    
    it(@"creates and shows an internal mobile web browser", ^{
        id viewControllerMock = [OCMockObject partialMockForObject:viewController];
        [[viewControllerMock expect] showViewController:[OCMArg checkForClass:[ARInternalMobileWebViewController class]]];
        
        [viewController loadMartsyView];
        
        [viewControllerMock verify];
    });
});

describe(@"showViewController:", ^{
    __block ARProfileViewController *viewController;
    
    beforeEach(^{
        viewController = [[ARProfileViewController alloc] initWithProfileID:profileID];
    });
    
    it(@"adds as a child view controller", ^{
        id viewControllerParameter = [[UIViewController alloc] init];
        
        id viewControllerMock = [OCMockObject partialMockForObject:viewController];
        
        [[viewControllerMock expect] ar_addModernChildViewController:viewControllerParameter];
        
        [viewController showViewController:viewControllerParameter];
        [viewControllerMock verify];
    });
    
    it(@"Creates an alignment based on the top layout guide", ^{
        ARProfileViewControllerTestsConcreteLayoutGuide *layoutGuide = [[ARProfileViewControllerTestsConcreteLayoutGuide alloc] init];
        layoutGuide.length = 1337.0f;
        
        id viewMock = [OCMockObject mockForClass:[UIView class]];
        [[viewMock expect] alignTop:[NSString stringWithFormat:@"%f", layoutGuide.length]
                            leading:@"0"
                             bottom:@"0"
                           trailing:@"0"
                             toView:OCMOCK_ANY];
        
        id viewControllerMock = [OCMockObject partialMockForObject:viewController];
        [[[viewControllerMock stub] andReturn:layoutGuide] topLayoutGuide];
    });
});

SpecEnd;
