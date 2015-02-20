#import "ARBrowseFeaturedLinksCollectionView.h"
#import "ARBrowseFeaturedLinksCollectionViewCell.h"
#import "ARBrowseFeaturedLinkInsetCell.h"
#import "UIDevice-Hardware.h"
#import <UIKit/UIKit.h>
#import "ARSwitchBoard.h"

@interface ARBrowseFeaturedLinksCollectionViewDelegateObject : NSObject<ARBrowseFeaturedLinksCollectionViewDelegate>

@end

@implementation ARBrowseFeaturedLinksCollectionViewDelegateObject

-(void)didSelectFeaturedLink:(FeaturedLink *)featuredLink {}

@end

@interface ARBrowseFeaturedLinksCollectionView(Testing)
- (UIScrollView *)secondaryScroll;
- (void)setupPaging;
- (NSString *)reuseIdentifier;
@end

SpecBegin(ARBrowseFeaturedLinksCollectionView)

__block ARBrowseFeaturedLinksCollectionView *collectionView = nil;

describe(@"initWithStyle", ^{

    sharedExamplesFor(@"general view setup", ^(NSDictionary *data){
        it(@"sets the layout and frame", ^{
            UICollectionViewFlowLayout *layout = (UICollectionViewFlowLayout *)collectionView.collectionViewLayout;
            expect(layout.class).to.equal([UICollectionViewFlowLayout class]);
            expect(layout.scrollDirection).to.equal(UICollectionViewScrollDirectionHorizontal);
        });

        it (@"sets ui options", ^{
            expect(collectionView.showsHorizontalScrollIndicator).to.beFalsy();
            expect(collectionView.backgroundColor).to.equal([UIColor whiteColor]);
        });

        it(@"sets the dataSource and delegate to self", ^{
            expect(collectionView.dataSource).to.equal(collectionView);
            expect(collectionView.delegate).to.equal(collectionView);
        });
    });

    describe(@"with ARFeaturedLinkLayoutSingleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutSingleRow;

        beforeEach(^{
            collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:style];
        });

        it(@"sets the style", ^{
            expect(collectionView.style).to.equal(style);
        });

        it(@"does not set secondary scroll", ^{
            expect([collectionView secondaryScroll]).to.beNil();
        });


        it(@"looks correct", ^{
            collectionView.featuredLinks = @[
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil]
            ];
            expect(collectionView).to.haveValidSnapshot();
        });
        
        itBehavesLike(@"general view setup", nil);
    });

    describe(@"with ARFeaturedLinkLayoutDoubleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutDoubleRow;

        beforeEach(^{
            collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:style];
        });

        it(@"sets the style", ^{
            expect(collectionView.style).to.equal(style);
        });

        it(@"does not set secondary scroll", ^{
            expect([collectionView secondaryScroll]).to.beNil();
        });

        it(@"looks correct", ^{
            collectionView.featuredLinks = @[
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil]
            ];
            expect(collectionView).to.haveValidSnapshot();
        });

        itBehavesLike(@"general view setup", nil);
    });
});

describe(@"setupPaging", ^{
    __block UIScrollView *scrollView = nil;
    beforeEach(^{
        CGRect frame = CGRectMake(0, 0, 320, 200);
        UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
        collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithFrame:frame collectionViewLayout:layout];
        [collectionView setupPaging];
        scrollView = collectionView.secondaryScroll;
    });

    it(@"sets up the scroll view", ^{
        expect(scrollView.bounds).to.equal(CGRectMake(0, 0, 208, 195));
        expect(scrollView.clipsToBounds).to.beFalsy();
        expect(scrollView.delegate).to.equal(collectionView);
        expect(scrollView.hidden).to.beTruthy();
        expect(scrollView.pagingEnabled).to.beTruthy();
    });

    it(@"updates its subviews and gestures", ^{
        expect(collectionView.subviews ).to.contain(scrollView);
        expect(collectionView.panGestureRecognizer.enabled).to.beFalsy();
        expect(collectionView.gestureRecognizers).to.contain(scrollView.panGestureRecognizer);
    });
});

describe(@"numberOfItemsInSection", ^{
    it(@"returns the number of featuredLinks", ^{
        collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        collectionView.featuredLinks = @[@1, @2, @3, @4, @5];
        expect([collectionView collectionView:collectionView numberOfItemsInSection:0]).to.equal(5);
    });
});

describe(@"cellForItemAtIndexPath", ^{
    __block NSIndexPath *index = nil;
    __block FeaturedLink *link = nil;
    __block UICollectionViewCell *cell = nil;
    before(^{
        collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        index = [NSIndexPath indexPathForItem:0 inSection:0];
        link = [FeaturedLink modelWithJSON:@{ @"title" : @"one", @"href" : @"/post/one" } error:nil];
        collectionView.featuredLinks = @[link];
        cell = [collectionView collectionView:collectionView cellForItemAtIndexPath:index];
    });

    it(@"updates cell with link", ^{
        expect([(ARBrowseFeaturedLinksCollectionViewCell*)cell titleLabel].text).to.equal(@"ONE");
    });

    it(@"assigns reuse identifier", ^{
        expect(cell.reuseIdentifier).to.equal([collectionView reuseIdentifier]);
    });
});

describe(@"setFeaturedLinks", ^{
    __block NSArray *links = @[@1, @2, @3];
    it(@"sets featured links", ^{
        collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        collectionView.featuredLinks = links;
        expect(collectionView.featuredLinks).to.equal(links.copy);
    });
});

describe(@"didSelectItemAtIndexPath", ^{
    it(@"loads item's link", ^{
        id mockDelegate = [OCMockObject mockForClass:[ARBrowseFeaturedLinksCollectionViewDelegateObject class]];
        collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        FeaturedLink *link = [FeaturedLink modelWithJSON:@{ @"title" : @"one", @"href" : @"/post/one" } error:nil];
        collectionView.featuredLinks = @[link];
        collectionView.selectionDelegate = mockDelegate;

        [[mockDelegate expect] didSelectFeaturedLink:link];
        NSIndexPath *index = [NSIndexPath indexPathForItem:0 inSection:0];
        [collectionView collectionView:collectionView didSelectItemAtIndexPath:index];
        [mockDelegate verify];
    });
});

describe(@"reuseIdentifier", ^{
    it(@"returns normal cell", ^{
        collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
        expect([collectionView reuseIdentifier]).to.equal([ARBrowseFeaturedLinksCollectionViewCell reuseID]);
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
            collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:style];
        });

        it(@"looks correct", ^{
            collectionView.featuredLinks = @[
                                             [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                                             [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                                             [[FeaturedLink alloc] initWithDictionary:@{@"title" : @"Title"} error:nil],
                                             ];
            expect(collectionView).to.haveValidSnapshot();
        });
        
    });

    describe(@"with ARFeaturedLinkLayoutDoubleRow", ^{
        ARFeaturedLinkStyle style = ARFeaturedLinkLayoutDoubleRow;

        beforeEach(^{
            collectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:style];
        });

        it(@"looks correct", ^{
            collectionView.featuredLinks = @[
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
            expect(collectionView).to.haveValidSnapshot();
        });
        
    });
});

SpecEnd
