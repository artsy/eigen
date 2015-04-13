#import "ARBrowseCategoriesViewController.h"
#import "ARBrowseFeaturedLinksCollectionView.h"
#import <ORStackView/ORStackScrollView.h>
#import "ARUserManager+Stubs.h"

@interface ARBrowseCategoriesViewController (Tests)
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@end

SpecBegin(ARBrowseCategoriesViewController)

__block ARBrowseCategoriesViewController *viewController;

describe(@"", ^{
    before(^{
        // used to find the sets called "Featured Categories", but really these are featured genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets"
                                 withParams:@{ @"key" : @"browse:featured-genes", @"mobile" : @"true", @"published" : @"true", @"sort" : @"key" }
                               withResponse:@[ @{ @"id" : @"featured-genes", @"name" : @"Featured Categories", @"item_type" : @"FeaturedLink" } ]
         ];

        // used to find the set called "Gene Categories"
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets"
                                 withParams:@{ @"key" : @"browse:gene-categories", @"published" : @"true", @"mobile" : @"true", @"sort" : @"key" }
                               withResponse:@[@{ @"id" : @"featured-categories", @"name" : @"Gene Categories", @"item_type" : @"OrderedSet" }]
         ];

        // these are ordered sets of genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/featured-categories/items"
                               withResponse:@[@{ @"id" : @"subject-matter-genes", @"name" : @"Subject Matter Genes", @"item_type" : @"FeaturedLink" },
                                              @{ @"id" : @"mew-media-genes", @"name" : @"New Media Genes", @"item_type" : @"FeaturedLink" }]
         ];

        // items inside a featured category, a collection of featured links
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/subject-matter-genes/items"
                               withResponse:@[@{ @"id" : @"s1", @"title" : @"S1", @"href" : @"/gene/s1" },
                                              @{ @"id" : @"s2", @"title" : @"S2", @"href" : @"/gene/s2" },
                                              @{ @"id" : @"s3", @"title" : @"S3", @"href" : @"/gene/s3" },
                                              @{ @"id" : @"s4", @"title" : @"S4", @"href" : @"/gene/s4" },
                                              @{ @"id" : @"s5", @"title" : @"S5", @"href" : @"/gene/s5" },
                                              @{ @"id" : @"s6", @"title" : @"S6", @"href" : @"/gene/s6" }]
         ];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/mew-media-genes/items"
                               withResponse:@[@{ @"id" : @"m1", @"title" : @"M1", @"href" : @"/gene/m1" },
                                              @{ @"id" : @"m2", @"title" : @"M2", @"href" : @"/gene/m2" }]
         ];

        // featured categories are a collection of genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/featured-genes/items"
                               withResponse:@[@{ @"id" : @"modern", @"title" : @"Modern", @"item_type" : @"FeaturedLink" },
                                              @{ @"id" : @"spumato", @"title" : @"Spumato", @"item_type" : @"FeaturedLink"}]
         ];
        
        viewController = [[ARBrowseCategoriesViewController alloc] init];
        viewController.shouldAnimate = NO;
    });


    describe(@"iphone", ^{

        it(@"presents featured categories and genes", ^{
            expect(viewController.view).to.beKindOf([ORStackScrollView class]);
            ORStackView *stackView = ((ORStackScrollView *)viewController.view).stackView;
            expect(stackView).toNot.beNil();

            expect(stackView.subviews.count).will.equal(6); // label, featured genes, label, genes, label, genes

            expect(stackView.subviews[0]).to.beKindOf([UILabel class]);
            expect([((UILabel *)stackView.subviews[0]) text]).to.equal(@"FEATURED CATEGORIES");
            expect(stackView.subviews[1]).to.beKindOf([ARBrowseFeaturedLinksCollectionView class]);

            expect(stackView.subviews[2]).to.beKindOf([UILabel class]);
            expect([((UILabel *)stackView.subviews[2]) text]).to.equal(@"SUBJECT MATTER GENES");
            expect(stackView.subviews[3]).to.beKindOf([ARBrowseFeaturedLinksCollectionView class]);

            expect(stackView.subviews[4]).to.beKindOf([UILabel class]);
            expect([((UILabel *)stackView.subviews[4]) text]).to.equal(@"NEW MEDIA GENES");
            expect(stackView.subviews[5]).to.beKindOf([ARBrowseFeaturedLinksCollectionView class]);
        });

        it(@"looks correct", ^{
            [ARTestContext stubDevice:ARDeviceTypePhone6];
            [viewController ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
            expect(viewController.view).will.haveValidSnapshot();
            [ARTestContext stopStubbing];

        });
    });

    describe(@"ipad", ^{

        it(@"looks correct", ^{
            waitUntil(^(DoneCallback done) {
                [ARTestContext stubDevice:ARDeviceTypePad];
                [viewController ar_presentWithFrame:CGRectMake(0, 0, 768, 1024)];
                activelyWaitFor(0.3, ^{
                    expect(viewController.view).will.haveValidSnapshot();
                    [ARTestContext stopStubbing];
                    done();
                });
            });
        });
    });
});

SpecEnd
