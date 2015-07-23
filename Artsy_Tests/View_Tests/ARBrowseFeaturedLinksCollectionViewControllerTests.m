#import "ARBrowseFeaturedLinksCollectionViewController.h"
#import "ARBrowseFeaturedLinksCollectionViewCell.h"
#import "UIDevice-Hardware.h"
#import <UIKit/UIKit.h>
#import "ARSwitchBoard.h"


@interface ARBrowseFeaturedLinksCollectionViewDelegateObject : NSObject <ARBrowseFeaturedLinksCollectionViewControllerDelegate>

@end


@implementation ARBrowseFeaturedLinksCollectionViewDelegateObject
- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink {}
@end


@interface ARBrowseFeaturedLinksCollectionViewController (Testing)
- (NSString *)reuseIdentifier;
- (UICollectionViewFlowLayout *)layout;
@property (nonatomic, strong) UICollectionView *view;
@end

SpecBegin(ARBrowseFeaturedLinksCollectionViewController);

__block ARBrowseFeaturedLinksCollectionViewController *vc = nil;

describe(@"initWithStyle", ^{

    sharedExamplesFor(@"general view setup", ^(NSDictionary *data){
        it(@"sets the layout and frame", ^{
            UICollectionViewFlowLayout *layout = vc.layout;
            expect(layout.class).to.equal([UICollectionViewFlowLayout class]);
            expect(layout.scrollDirection).to.equal(UICollectionViewScrollDirectionHorizontal);
        });

        it (@"sets ui options", ^{
            expect(vc.view.showsHorizontalScrollIndicator).to.beFalsy();
            expect(vc.view.backgroundColor).to.equal([UIColor whiteColor]);
        });

        it(@"sets the dataSource and delegate to self", ^{
            expect(vc.view.dataSource).to.equal(vc);
            expect(vc.view.delegate).to.equal(vc);
        });
    });

    describe(@"with ARFeaturedLinkLayoutSingleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutSingleRow;

        beforeEach(^{
            vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style];
        });

        it(@"sets the style", ^{
            expect(vc.style).to.equal(style);
        });

        it(@"looks correct", ^{
            vc.featuredLinks = @[
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil]
            ];
            expect(vc).to.haveValidSnapshot();
        });
        
        itBehavesLike(@"general view setup", nil);
    });

    describe(@"with ARFeaturedLinkLayoutDoubleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutDoubleRow;

        beforeEach(^{
            vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style];
        });

        it(@"sets the style", ^{
            expect(vc.style).to.equal(style);
        });

        it(@"looks correct", ^{
            vc.featuredLinks = @[
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil]
            ];
            expect(vc).to.haveValidSnapshot();
        });

        itBehavesLike(@"general view setup", nil);
    });
});

describe(@"numberOfItemsInSection", ^{
    it(@"returns the number of featuredLinks", ^{
        vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        vc.featuredLinks = @[@1, @2, @3, @4, @5];
        expect([vc collectionView:vc.view numberOfItemsInSection:0]).to.equal(5);
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
        cell = [vc collectionView:vc.view cellForItemAtIndexPath:index];
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
        [vc collectionView:vc.view didSelectItemAtIndexPath:index];
        [mockDelegate verify];
    });
});

describe(@"reuseIdentifier", ^{
    it(@"returns normal cell", ^{
        vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        expect([vc reuseIdentifier]).to.equal([ARBrowseFeaturedLinksCollectionViewCell reuseID]);
    });
});

describe(@"ipad snapshots", ^{
    before(^{
        [ARTestContext stubDevice:ARDeviceTypePad];
    });

    after(^{
        [ARTestContext stopStubbing];
    });

    describe(@"with ARFeaturedLinkLayoutSingleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutSingleRow;

        beforeEach(^{
            vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style];
        });

        it(@"looks correct", ^{
            vc.featuredLinks = @[
                                             [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                                             [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                                             [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                                             ];
            expect(vc).to.haveValidSnapshot();
        });
    });

    describe(@"with ARFeaturedLinkLayoutDoubleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutDoubleRow;

        beforeEach(^{
            vc = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:style];
        });

        it(@"looks correct", ^{
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
            expect(vc).to.haveValidSnapshot();
        });
    });
});

SpecEnd
