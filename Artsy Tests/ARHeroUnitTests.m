
#import "ARHeroUnitViewController.h"
#import "ARHeroUnitsNetworkModel.h"
#import "SiteHeroUnit.h"

@interface ARSiteHeroUnitViewController : UIViewController
@end

@interface ARHeroUnitViewController (Test)
@property (nonatomic, strong) UIPageControl *pageControl;
@property (nonatomic, strong) UIPageViewController *pageViewController;
@property (nonatomic, strong) NSTimer *timer;
- (void)startTimer;
- (void)updateViewWithHeroUnits:(NSArray *)heroUnits;
- (ARSiteHeroUnitViewController *)currentViewController;
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
    success(self.heroUnits);
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

    describe(@"updateViewWithHeroUnits", ^{
        before(^{
            sharedBefore();
            [heroVC updateViewWithHeroUnits:heroUnits];
        });

        it(@"sets pageControl", ^{
            expect(heroVC.pageControl.hidden).to.beFalsy();
            expect(heroVC.pageControl.numberOfPages).to.equal(3);
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

    itHasSnapshotsForDevices(@"with three units", ^{
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

    itHasSnapshotsForDevices(@"with one unit", ^{
        sharedBefore();
        [heroVC updateViewWithHeroUnits:heroUnits];
        return heroVC;
    });
});

describe(@"with no hero units", ^{
    // In practice this should never happen. If there are ever zero hero units, there is a data problem.
    before(^{
        heroUnits = @[];
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

    itHasSnapshotsForDevices(@"with no units", ^{
        sharedBefore();
        [heroVC updateViewWithHeroUnits:heroUnits];
        return heroVC;
    });
});


SpecEnd