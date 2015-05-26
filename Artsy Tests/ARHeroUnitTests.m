
#import "ARHeroUnitViewController.h"
#import "ARHeroUnitsNetworkModel.h"
#import "SiteHeroUnit.h"

@interface ARSiteHeroUnitViewController : UIViewController
@property (nonatomic, assign) NSInteger index;
@property (nonatomic, assign) SiteHeroUnit *heroUnit;
@end

@interface ARHeroUnitViewController (Test)
@property (nonatomic, strong) UIPageControl *pageControl;
@property (nonatomic, strong) UIPageViewController *pageViewController;
@property (nonatomic, strong) NSTimer *timer;
- (void)startTimer;
- (void)updateViewWithHeroUnits:(NSArray *)heroUnits;
- (void)handleHeroUnits:(NSArray *)heroUnits;
- (ARSiteHeroUnitViewController *)currentViewController;
- (void)pageControlTapped:(id)sender;
@end

@interface ARHeroUnitsNetworkModel (Test)
@property (nonatomic, copy, readwrite) NSArray *heroUnits;
@end

@interface ARHeroUnitsTestDataSource : ARHeroUnitsNetworkModel
-(void)getHeroUnitsWithSuccess:(void (^)())success failure:(void (^)(NSError *error))failure;
@end

@implementation ARHeroUnitsTestDataSource
-(void)getHeroUnitsWithSuccess:(void (^)())success failure:(void (^)(NSError *error))failure
{
    self.heroUnits = [self.heroUnits copy];
    if (success) {
        success(self.heroUnits);
    }
}
@end

SpecBegin(ARHeroUnitViewController)
__block ARHeroUnitViewController *heroVC;
__block NSArray *heroUnits;

dispatch_block_t sharedBefore = ^{
    heroVC = [[ARHeroUnitViewController alloc] init];
    heroVC.heroUnitNetworkModel = [[ARHeroUnitsTestDataSource alloc] init];
    heroVC.heroUnitNetworkModel.heroUnits = heroUnits;
    expect(heroVC.view).toNot.beNil();
};

describe(@"with three hero units", ^{
    before(^{
        heroUnits = @[[SiteHeroUnit modelWithJSON:@{
            @"id": @"art-basel1",
            @"name": @"Art Basel1",
            @"heading": @"Exclusive Preview",
            @"mobile_description": @"Discover some artworks.",
            @"mobile_title": @"Art Basel",
            @"display_on_mobile": @true,
            @"position": @1,
            @"link":@"/art-basel1",
            @"link_text":@"Explore",
            @"credit_line":@"Artsy artsy artsy"
        }], [SiteHeroUnit modelWithJSON:@{
            @"id": @"art-basel2",
            @"name": @"Art Basel2",
            @"heading": @"Exclusive Preview",
            @"mobile_description": @"Discover some artworks.",
            @"mobile_title": @"Art Basel",
            @"display_on_mobile": @true,
            @"position": @2,
            @"link":@"/art-basel2",
            @"link_text":@"Explore",
            @"credit_line":@"Artsy artsy artsy"
        }], [SiteHeroUnit modelWithJSON:@{
            @"id": @"art-basel3",
            @"name": @"Art Basel3",
            @"heading": @"Exclusive Preview",
            @"mobile_description": @"Discover some artworks.",
            @"mobile_title": @"Art Basel",
            @"display_on_mobile": @true,
            @"position": @3,
            @"link":@"/art-basel3",
            @"link_text":@"Explore",
            @"credit_line":@"Artsy artsy artsy"
        }]];
    });

    describe(@"handleHeroUnits", ^{
        it(@"updates the view", ^{
            sharedBefore();
            id mock = [OCMockObject partialMockForObject:heroVC];
            [[mock expect] updateViewWithHeroUnits:heroUnits];
            [heroVC handleHeroUnits:heroUnits];
            [mock verify];
        });
    });

    describe(@"updateViewWithHeroUnits", ^{
        before(^{
            sharedBefore();
            [heroVC updateViewWithHeroUnits:heroUnits];
        });

        it(@"sets pageControl", ^{
            expect(heroVC.pageControl.hidden).to.beFalsy();
            expect(heroVC.pageControl.numberOfPages).to.equal(3);
        });

        it(@"responds to page control", ^{
            expect([heroVC currentViewController].index).to.equal(0);
            expect([heroVC currentViewController].heroUnit).to.equal(heroUnits[0]);

            heroVC.pageControl.currentPage = 1;
            [heroVC pageControlTapped:heroVC.pageControl];

            expect([heroVC currentViewController].index).to.equal(1);
            expect([heroVC currentViewController].heroUnit).to.equal(heroUnits[1]);
        });

        it(@"sets the first view controller", ^{
            expect(heroVC.pageViewController.viewControllers.count).to.equal(1);
        });

        it(@"currentViewController returns a vc", ^{
            ARSiteHeroUnitViewController *currentViewController = [heroVC currentViewController];
            expect(currentViewController).notTo.beNil();
            expect(currentViewController).to.beKindOf([ARSiteHeroUnitViewController class]);
        });
    });


    it(@"startTimer sets timer for page turn", ^{
        sharedBefore();
        [heroVC startTimer];
        expect(heroVC.timer).toNot.beNil();
    });

    itHasSnapshotsForDevicesWithName(@"with three units", ^{
        sharedBefore();
        [heroVC updateViewWithHeroUnits:heroUnits];
        return heroVC;
    });
});

describe(@"with one hero unit", ^{
    before(^{
        heroUnits = @[[SiteHeroUnit modelWithJSON:@{
            @"id": @"art-basel1",
            @"name": @"Art Basel1",
            @"heading": @"Exclusive Preview",
            @"mobile_description": @"Discover some artworks.",
            @"mobile_title": @"Art Basel",
            @"display_on_mobile": @true,
            @"position": @1,
            @"link":@"/art-basel1",
            @"link_text":@"Explore",
            @"credit_line":@"Artsy artsy artsy"
        }]];
    });

    describe(@"handleHeroUnits", ^{
        it(@"updates the view", ^{
            sharedBefore();
            id mock = [OCMockObject partialMockForObject:heroVC];
            [[mock expect] updateViewWithHeroUnits:heroUnits];
            [heroVC handleHeroUnits:heroUnits];
            [mock verify];
        });
    });

    describe(@"updateViewWithHeroUnits", ^{
        before(^{
            sharedBefore();
            [heroVC updateViewWithHeroUnits:heroUnits];
        });

        it(@"sets pageControl", ^{
            expect(heroVC.pageControl.hidden).to.beTruthy();
            expect(heroVC.pageControl.numberOfPages).to.equal(1);
        });

        it(@"sets the first view controller", ^{
            expect(heroVC.pageViewController.viewControllers.count).to.equal(1);
        });

        it(@"currentViewController returns a vc", ^{
            ARSiteHeroUnitViewController *currentViewController = [heroVC currentViewController];
            expect(currentViewController).notTo.beNil();
            expect(currentViewController).to.beKindOf([ARSiteHeroUnitViewController class]);
        });
    });

    it(@"startTimer doesn't set timer for page turn", ^{
        sharedBefore();
        [heroVC startTimer];
        expect(heroVC.timer).to.beNil();
    });

    itHasSnapshotsForDevicesWithName(@"with one unit", ^{
        sharedBefore();
        [heroVC updateViewWithHeroUnits:heroUnits];
        return heroVC;
    });
});

describe(@"viewWillAppear", ^{
    __block id mock;
    __block id networkModelMock;
    before(^{
        mock = [OCMockObject partialMockForObject:heroVC];
        heroUnits = @[[SiteHeroUnit modelWithJSON:@{
            @"id": @"art-basel1",
            @"name": @"Art Basel1",
            @"heading": @"Exclusive Preview",
            @"mobile_description": @"Discover some artworks.",
            @"mobile_title": @"Art Basel",
            @"display_on_mobile": @true,
            @"position": @1,
            @"link":@"/art-basel1",
            @"link_text":@"Explore",
            @"credit_line":@"Artsy artsy artsy"
        }], [SiteHeroUnit modelWithJSON:@{
            @"id": @"art-basel2",
            @"name": @"Art Basel2",
            @"heading": @"Exclusive Preview",
            @"mobile_description": @"Discover some artworks.",
            @"mobile_title": @"Art Basel",
            @"display_on_mobile": @true,
            @"position": @2,
            @"link":@"/art-basel2",
            @"link_text":@"Explore",
            @"credit_line":@"Artsy artsy artsy"
        }], [SiteHeroUnit modelWithJSON:@{
            @"id": @"art-basel3",
            @"name": @"Art Basel3",
            @"heading": @"Exclusive Preview",
            @"mobile_description": @"Discover some artworks.",
            @"mobile_title": @"Art Basel",
            @"display_on_mobile": @true,
            @"position": @3,
            @"link":@"/art-basel3",
            @"link_text":@"Explore",
            @"credit_line":@"Artsy artsy artsy"
        }]];
        sharedBefore();
        networkModelMock = [OCMockObject partialMockForObject:heroVC.heroUnitNetworkModel];
    });

    it(@"refetches hero units", ^{
        [[networkModelMock expect] getHeroUnitsWithSuccess:OCMOCK_ANY failure:OCMOCK_ANY];
        [heroVC viewWillAppear:NO];
        [networkModelMock verify];
    });

    it(@"does not update view if they are the same", ^{
        [[mock reject] updateViewWithHeroUnits:OCMOCK_ANY];
        [heroVC viewWillAppear:NO];
        [mock verify];
    });

    it(@"updates view if units have changed", ^{
        __block NSArray *units = [heroUnits arrayByAddingObject:[SiteHeroUnit modelWithJSON:@{
           @"id": @"art-basel4",
           @"name": @"Art Basel4",
           @"heading": @"Exclusive Preview",
           @"mobile_description": @"Discover some artworks.",
           @"mobile_title": @"Art Basel",
           @"display_on_mobile": @true,
           @"position": @3,
           @"link":@"/art-basel4",
           @"link_text":@"Explore",
           @"credit_line":@"Artsy artsy artsy"
       }]];

        [[[networkModelMock stub] andDo:^(NSInvocation *invocation) {
            void (^successBlock)(NSArray *) = nil;
            [invocation getArgument:&successBlock atIndex:2];

            heroVC.heroUnitNetworkModel.heroUnits = units;
            if(successBlock) {
                successBlock(units);
            }

        }] getHeroUnitsWithSuccess:OCMOCK_ANY failure:OCMOCK_ANY];

        [[mock expect] updateViewWithHeroUnits:units];

        [heroVC viewWillAppear:NO];
    });
});

describe(@"with no hero units", ^{
    // In practice this should never happen. If there are ever zero hero units, there is a data problem.
    before(^{
        heroUnits = @[];
    });

    describe(@"handleHeroUnits", ^{
        sharedBefore();
        id mock = [OCMockObject partialMockForObject:heroVC];
        [[mock reject] updateViewWithHeroUnits:OCMOCK_ANY];
        [heroVC handleHeroUnits:heroUnits];
        [mock verify];
    });

    describe(@"updateViewWithHeroUnits", ^{
        before(^{
            sharedBefore();
            [heroVC updateViewWithHeroUnits:heroUnits];
        });

        it(@"sets pageControl", ^{
            expect(heroVC.pageControl.hidden).to.beTruthy();
            expect(heroVC.pageControl.numberOfPages).to.equal(0);
        });

        it(@"sets the first view controller", ^{
            expect(heroVC.pageViewController.viewControllers.count).to.equal(0);
        });

        it(@"currentViewController returns nil", ^{
            ARSiteHeroUnitViewController *currentViewController = [heroVC currentViewController];
            expect(currentViewController).to.beNil();
        });
    });

    it(@"startTimer doesn't set timer for page turn", ^{
        sharedBefore();
        [heroVC startTimer];
        expect(heroVC.timer).to.beNil();
    });

    itHasSnapshotsForDevicesWithName(@"with no units", ^{
        sharedBefore();
        [heroVC updateViewWithHeroUnits:heroUnits];
        return heroVC;
    });
});


describe(@"alignment on iPad", ^{
    describe(@"align left", ^{
        before(^{
            [ARTestContext stubDevice:ARDeviceTypePad];
            heroUnits = @[[SiteHeroUnit modelWithJSON:@{
                @"id": @"art-basel1",
                @"name": @"Art Basel1",
                @"heading": @"Exclusive Preview",
                @"mobile_description": @"Discover some artworks.",
                @"mobile_title": @"Art Basel Art Basel Art Basel Art Basel Art Basel Art Basel Art Basel Art Basel",
                @"display_on_mobile": @true,
                @"type":@"left",
                @"position": @1,
                @"link":@"/art-basel1",
                @"link_text":@"Explore",
                @"credit_line":@"Artsy artsy artsy"
            }]];
        });

        after(^{
            [ARTestContext stopStubbing];
        });

        it(@"looks correct", ^{
            sharedBefore();
            [heroVC updateViewWithHeroUnits:heroUnits];
            expect(heroVC).to.haveValidSnapshot();
        });
    });

    describe(@"align right", ^{
        before(^{
            [ARTestContext stubDevice:ARDeviceTypePad];
            heroUnits = @[[SiteHeroUnit modelWithJSON:@{
                @"id": @"art-basel1",
                @"name": @"Art Basel1",
                @"heading": @"Exclusive Preview",
                @"mobile_description": @"Discover some artworks.",
                @"mobile_title": @"Art Basel Art Basel Art Basel Art Basel Art Basel Art Basel Art Basel Art Basel",
                @"display_on_mobile": @true,
                @"type":@"right",
                @"position": @1,
                @"link":@"/art-basel1",
                @"link_text":@"Explore",
                @"credit_line":@"Artsy artsy artsy"
            }]];
        });

        after(^{
            [ARTestContext stopStubbing];
        });

        it(@"looks correct", ^{
            sharedBefore();
            [heroVC updateViewWithHeroUnits:heroUnits];
            expect(heroVC).to.haveValidSnapshot();
        });
    });
});


SpecEnd