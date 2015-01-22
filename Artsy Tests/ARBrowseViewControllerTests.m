#import "ARBrowseViewController.h"
#import "ARBrowseFeaturedLinksCollectionView.h"
#import <ORStackView/ORStackScrollView.h>
#import "ARUserManager+Stubs.h"

@interface ARBrowseViewController (Tests)
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@end

SpecBegin(ARBrowseViewController)

__block ARBrowseViewController *viewController;
describe(@"iphone", ^{
    before(^{
        // used to find the sets called "Featured Categories", but really these are featured genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets"
                                 withParams:@{ @"key" : @"browse:featured-genes", @"mobile" : @"true", @"published" : @"true", @"sort" : @"key" }
                               withResponse:@[ @{ @"id" : @"featured-genes", @"name" : @"Featured Categories", @"item_type" : @"FeaturedLink" } ]
         ];

        // used to find the set called "Gene Categories"
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets"
                                 withParams:@{ @"key" : @"browse:gene-categories", @"published" : @"true", @"mobile" : @"true", @"sort" : @"key" }
                               withResponse:@[
                                              @{ @"id" : @"featured-categories", @"name" : @"Gene Categories", @"item_type" : @"OrderedSet" }
                                              ]
         ];

        // these are ordered sets of genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/featured-categories/items"
                               withResponse:@[
                                              @{ @"id" : @"subject-matter-genes", @"name" : @"Subject Matter Genes", @"item_type" : @"FeaturedLink" },
                                              @{ @"id" : @"mew-media-genes", @"name" : @"New Media Genes", @"item_type" : @"FeaturedLink" }
                                              ]
         ];

        // items inside a featured category, a collection of featured links
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/subject-matter-genes/items"
                               withResponse:@[
                                              @{ @"id" : @"s1", @"title" : @"S1", @"href" : @"/gene/s1" },
                                              @{ @"id" : @"s2", @"title" : @"S2", @"href" : @"/gene/s2" },
                                              @{ @"id" : @"s3", @"title" : @"S3", @"href" : @"/gene/s3" },
                                              @{ @"id" : @"s4", @"title" : @"S4", @"href" : @"/gene/s4" },
                                              @{ @"id" : @"s5", @"title" : @"S5", @"href" : @"/gene/s5" },
                                              @{ @"id" : @"s6", @"title" : @"S6", @"href" : @"/gene/s6" },
                                              ]
         ];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/mew-media-genes/items"
                               withResponse:@[
                                              @{ @"id" : @"m1", @"title" : @"M1", @"href" : @"/gene/m1" },
                                              @{ @"id" : @"m2", @"title" : @"M2", @"href" : @"/gene/m2" }
                                              ]
         ];
        
        // featured categories are a collection of genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/featured-genes/items"
                               withResponse:@[
                                              @{ @"id" : @"modern", @"title" : @"Modern", @"item_type" : @"FeaturedLink" },
                                              @{ @"id" : @"spumato", @"title" : @"Spumato", @"item_type" : @"FeaturedLink" }
                                              ]
         ];
        viewController = [[ARBrowseViewController alloc] init];
        viewController.shouldAnimate = NO;
    });

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
        [viewController ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
        expect(viewController.view).will.haveValidSnapshot();
    });
});

describe(@"ipad", ^{

    before(^{
        // used to find the sets called "Featured Categories", but really these are featured genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets"
                                 withParams:@{ @"key" : @"browse:featured-genes", @"mobile" : @"true", @"published" : @"true", @"sort" : @"key" }
                               withResponse:@[ @{ @"id" : @"featured-genes", @"name" : @"Featured Categories", @"item_type" : @"FeaturedLink" } ]
         ];


        // featured categories are a collection of genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/featured-genes/items"
                               withResponse:@[
                                              @{ @"id" : @"modern", @"title" : @"Modern", @"item_type" : @"FeaturedLink" },
                                              @{ @"id" : @"spumato", @"title" : @"Spumato", @"item_type" : @"FeaturedLink" }
                                              ]
         ];

        // used to find the set called "Gene Categories"
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets"
                                 withParams:@{ @"key" : @"browse:gene-categories", @"published" : @"true", @"mobile" : @"true", @"sort" : @"key" }
                               withResponse:@[
                                              @{ @"id" : @"featured-categories", @"name" : @"Gene Categories", @"item_type" : @"OrderedSet" }
                                              ]
         ];


        // these are ordered sets of genes
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/featured-categories/items"
                               withResponse:@[
                                              @{ @"id" : @"subject-matter-genes", @"name" : @"Subject Matter Genes", @"item_type" : @"FeaturedLink" },
                                              @{ @"id" : @"mew-media-genes", @"name" : @"New Media Genes", @"item_type" : @"FeaturedLink" },
                                              @{ @"id" : @"some-other-genes", @"name" : @"More Genes", @"item_type" : @"FeaturedLink" }
                                              ]
         ];

        // items inside a featured category, a collection of featured links
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/subject-matter-genes/items"
                               withResponse:@[
                                              @{ @"id" : @"s1", @"title" : @"S1", @"href" : @"/gene/s1" },
                                              @{ @"id" : @"s2", @"title" : @"S2", @"href" : @"/gene/s2" },
                                              @{ @"id" : @"s3", @"title" : @"S3", @"href" : @"/gene/s3" },
                                              @{ @"id" : @"s4", @"title" : @"S4", @"href" : @"/gene/s4" },
                                              @{ @"id" : @"s5", @"title" : @"S5", @"href" : @"/gene/s5" },
                                              @{ @"id" : @"s6", @"title" : @"S6", @"href" : @"/gene/s6" },
                                              @{ @"id" : @"s7", @"title" : @"S7", @"href" : @"/gene/s7" },
                                              @{ @"id" : @"s8", @"title" : @"S8", @"href" : @"/gene/s8" },
                                              @{ @"id" : @"s9", @"title" : @"S9", @"href" : @"/gene/s9" },
                                              @{ @"id" : @"s10", @"title" : @"S10", @"href" : @"/gene/s10" }
                                              ]
         ];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/mew-media-genes/items"
                               withResponse:@[
                                              @{ @"id" : @"m1", @"title" : @"M1", @"href" : @"/gene/m1" },
                                              @{ @"id" : @"m2", @"title" : @"M2", @"href" : @"/gene/m2" },
                                              @{ @"id" : @"m3", @"title" : @"M3", @"href" : @"/gene/m3" },
                                              @{ @"id" : @"m4", @"title" : @"M4", @"href" : @"/gene/m4" },
                                              @{ @"id" : @"m5", @"title" : @"M5", @"href" : @"/gene/m5" },
                                              @{ @"id" : @"m6", @"title" : @"M6", @"href" : @"/gene/m6" },
                                              @{ @"id" : @"m7", @"title" : @"M7", @"href" : @"/gene/m7" },
                                              @{ @"id" : @"m8", @"title" : @"M8", @"href" : @"/gene/m8" },
                                              @{ @"id" : @"m9", @"title" : @"M9", @"href" : @"/gene/m9" },
                                              @{ @"id" : @"m10", @"title" : @"M10", @"href" : @"/gene/m10" }
                                              ]
         ];


        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/some-other-genes/items"
                               withResponse:@[
                                              @{ @"id" : @"g1", @"title" : @"G1", @"href" : @"/gene/g1" },
                                              @{ @"id" : @"g2", @"title" : @"G2", @"href" : @"/gene/g2" },
                                              @{ @"id" : @"g3", @"title" : @"G3", @"href" : @"/gene/g3" },
                                              @{ @"id" : @"g4", @"title" : @"G4", @"href" : @"/gene/g4" },
                                              @{ @"id" : @"g5", @"title" : @"G5", @"href" : @"/gene/g5" },
                                              @{ @"id" : @"g6", @"title" : @"G6", @"href" : @"/gene/g6" },
                                              @{ @"id" : @"g7", @"title" : @"G7", @"href" : @"/gene/g7" },
                                              @{ @"id" : @"g8", @"title" : @"G8", @"href" : @"/gene/g8" },
                                              @{ @"id" : @"g9", @"title" : @"G9", @"href" : @"/gene/g9" },
                                              @{ @"id" : @"g10", @"title" : @"G10", @"href" : @"/gene/g10" }
                                              ]
         ];

        viewController = [[ARBrowseViewController alloc] init];
        viewController.shouldAnimate = NO;
    });

    it(@"looks correct", ^{
        waitUntil(^(DoneCallback done) {
            [ARTestContext stubDevice:ARDeviceTypePad];
            [viewController ar_presentWithFrame:CGRectMake(0, 0, 768, 1024)];
            activelyWaitFor(0.5, ^{
                expect(viewController.view).will.haveValidSnapshot();
                [ARTestContext stopStubbing];
                done();
            });
        });
    });
});

SpecEnd
