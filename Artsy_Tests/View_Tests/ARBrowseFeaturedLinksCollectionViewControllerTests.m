#import "ARBrowseFeaturedLinksCollectionViewController.h"
#import "ARBrowseFeaturedLinksCollectionViewCell.h"
#import "UIDevice-Hardware.h"
#import <UIKit/UIKit.h>
#import "ARSwitchBoard.h"
#import "UIViewController+SimpleChildren.h"
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARBrowseFeaturedLinksCollectionViewDelegateObject : NSObject <ARBrowseFeaturedLinksCollectionViewControllerDelegate>

@end


@implementation ARBrowseFeaturedLinksCollectionViewDelegateObject
- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink {}
@end


@interface ARBrowseFeaturedLinksCollectionViewController (Testing)
- (NSString *)reuseIdentifier;
@property (nonatomic, readonly) UICollectionViewFlowLayout *collectionViewLayout;
- (void)updateItemSizeWithParentSize:(CGSize)size;
@end

SpecBegin(ARBrowseFeaturedLinksCollectionViewController);
__block ARBrowseFeaturedLinksCollectionViewController *vc;

describe(@"appearance", ^{
    sharedExamplesFor(@"general view setup", ^(NSDictionary *data){

        __block ARBrowseFeaturedLinksCollectionViewController *testVC = data[@"vc"];

        it(@"sets the layout", ^{
            UICollectionViewFlowLayout *layout = testVC.collectionViewLayout;
            expect(layout).to.beAKindOf([UICollectionViewFlowLayout class]);
            expect(layout.scrollDirection).to.equal(UICollectionViewScrollDirectionHorizontal);
        });

        it (@"sets ui options", ^{
            expect(testVC.collectionView.showsHorizontalScrollIndicator).to.beFalsy();
            expect(testVC.collectionView.backgroundColor).to.equal([UIColor whiteColor]);
        });

        it(@"sets the dataSource and delegate to self", ^{
            expect(testVC.collectionView.dataSource).to.equal(testVC);
            expect(testVC.collectionView.delegate).to.equal(testVC);
        });
    });

    describe(@"with ARFeaturedLinkLayoutSingleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutSingleRow;

        it(@"sets the style", ^{
            vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style];
            expect(vc.style).to.equal(style);
        });

        itBehavesLike(@"general view setup", @{@"vc":[[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style]});

        UIViewController*(^block)(void) = ^UIViewController *(){
            vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style];
            UIViewController *parentVC = [[UIViewController alloc] init];
            [parentVC ar_addChildViewController:vc atFrame:CGRectZero];
            [vc.view alignLeading:@"0" trailing:@"0" toView:parentVC.view];
            [vc.view alignTopEdgeWithView:parentVC.view predicate:@"0"];
            [parentVC ar_presentWithFrame:[UIScreen mainScreen].bounds];
            [parentVC.view layoutIfNeeded];
            vc.featuredLinks = @[
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
            ];
            return vc;
        };

        itHasSnapshotsForDevices(block);
    });

    describe(@"with ARFeaturedLinkLayoutDoubleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutDoubleRow;

        it(@"sets the style", ^{
            vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style];
            expect(vc.style).to.equal(style);
        });

        itHasSnapshotsForDevices(^{
            vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style];
            UIViewController *parentVC = [[UIViewController alloc] init];
            [parentVC ar_addChildViewController:vc atFrame:CGRectZero];
            [vc.view alignLeading:@"0" trailing:@"0" toView:parentVC.view];
            [vc.view alignTopEdgeWithView:parentVC.view predicate:@"0"];
            [parentVC ar_presentWithFrame:[UIScreen mainScreen].bounds];
            [parentVC.view layoutIfNeeded];
            vc.featuredLinks = @[
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil]
            ];
            return vc;
        });

        itBehavesLike(@"general view setup", @{@"vc":[[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style]});
    });
});


describe(@"numberOfItemsInSection", ^{
    it(@"returns the number of featuredLinks", ^{
        vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        vc.featuredLinks = @[@1, @2, @3, @4, @5];
        expect([vc collectionView:vc.collectionView numberOfItemsInSection:0]).to.equal(5);
    });
});

describe(@"cellForItemAtIndexPath", ^{
    __block NSIndexPath *index = nil;
    __block FeaturedLink *link = nil;
    __block UICollectionViewCell *cell = nil;

    before(^{
        vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        index = [NSIndexPath indexPathForItem:0 inSection:0];
        link = [FeaturedLink modelWithJSON:@{ @"title" : @"one", @"href" : @"/post/one" } error:nil];
        vc.featuredLinks = @[link];
        cell = [vc collectionView:vc.collectionView cellForItemAtIndexPath:index];
    });

    it(@"updates cell with link", ^{
        expect([(ARBrowseFeaturedLinksCollectionViewCell*)cell titleLabel].text).to.equal(@"ONE");
    });

    it(@"assigns reuse identifier", ^{
        expect(cell.reuseIdentifier).to.equal([vc reuseIdentifier]);
    });
});

describe(@"setFeaturedLinks", ^{
    __block NSArray *links = @[@1, @2, @3];
    it(@"sets featured links", ^{
        vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        vc.featuredLinks = links;
        expect(vc.featuredLinks).to.equal(links.copy);
    });
});

describe(@"didSelectItemAtIndexPath", ^{
    it(@"loads item's link", ^{
        id mockDelegate = [OCMockObject mockForClass:[ARBrowseFeaturedLinksCollectionViewDelegateObject class]];
        vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        FeaturedLink *link = [FeaturedLink modelWithJSON:@{ @"title" : @"one", @"href" : @"/post/one" } error:nil];
        vc.featuredLinks = @[link];
        vc.selectionDelegate = mockDelegate;

        [[mockDelegate expect] didSelectFeaturedLink:link];
        NSIndexPath *index = [NSIndexPath indexPathForItem:0 inSection:0];
        [vc collectionView:vc.collectionView didSelectItemAtIndexPath:index];
        [mockDelegate verify];
    });
});

describe(@"reuseIdentifier", ^{
    it(@"returns normal cell", ^{
        vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        expect([vc reuseIdentifier]).to.equal([ARBrowseFeaturedLinksCollectionViewCell reuseID]);
    });
});

describe(@"model", ^{
    it(@"strips additional whitespace", ^{
        FeaturedLink *link = [FeaturedLink modelWithJSON:@{ @"title" : @"one", @"href" : @"/post/one " } error:nil];
        expect(link.href).to.equal(@"/post/one");
    });
});

SpecEnd;
