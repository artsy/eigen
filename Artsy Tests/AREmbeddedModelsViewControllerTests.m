#import "AREmbeddedModelsViewController.h"
#import "ARArtworkMasonryModule.h"


@interface AREmbeddedModelsViewController (Testing)

@property (nonatomic, strong, readwrite) UICollectionView *collectionView;

@end

@interface ARArtworkMasonryModule (Private)
+ (CGFloat)dimensionForlayout:(ARArtworkMasonryLayout)layout useLandscapeValues:(BOOL)useLandscapeValues;
@end

static CGFloat
AspectRatioForMultiplier(CGFloat multiplier, ARArtworkMasonryLayout layout) {
    switch (layout) {
        case ARArtworkMasonryLayout1Column:
        case ARArtworkMasonryLayout2Column:
        case ARArtworkMasonryLayout3Column:
        case ARArtworkMasonryLayout4Column:
            {
                CGFloat dimension = [ARArtworkMasonryModule dimensionForlayout:layout useLandscapeValues:NO];
                return dimension / (dimension * multiplier);
            }

        case ARArtworkMasonryLayout1Row:
        case ARArtworkMasonryLayout2Row:
            return multiplier;
    }
}

static Artwork *
ArtworkWithImageAspectRatio(CGFloat aspectRatio) {
    return [Artwork modelWithJSON:@{ @"images": @[@{ @"is_default": @YES, @"aspect_ratio":@(aspectRatio) }] }];
}

static AREmbeddedModelsViewController *
AREmbeddedModelsViewControllerWithLayout(ARArtworkMasonryLayout layout) {
    ARArtworkMasonryModule *module = [ARArtworkMasonryModule masonryModuleWithLayout:layout];
    AREmbeddedModelsViewController *viewController = [AREmbeddedModelsViewController new];
    viewController.activeModule = module;
    return viewController;
}

SpecBegin(AREmbeddedModelsViewController)

describe(@"masonry layout", ^{
    __block AREmbeddedModelsViewController *viewController = nil;

    describe(@"with vertical columns", ^{
        beforeEach(^{
            viewController = AREmbeddedModelsViewControllerWithLayout(ARArtworkMasonryLayout2Column);
        });

        it(@"allows a trailing entry to the right to stick out if it sticks out <= 50% of its height", ^{
            [viewController appendItems:@[
                ArtworkWithImageAspectRatio(1),
                ArtworkWithImageAspectRatio(AspectRatioForMultiplier(1.5, ARArtworkMasonryLayout2Column)),
                ArtworkWithImageAspectRatio(1),
                ArtworkWithImageAspectRatio(1),
            ]];
            expect(viewController.view).to.haveValidSnapshot();
        });

        it(@"moves a trailing entry to the left if it would normally be at the right and stick out from the rest by more than 50% of its height", ^{
            [viewController appendItems:@[
                ArtworkWithImageAspectRatio(1),
                ArtworkWithImageAspectRatio(AspectRatioForMultiplier(1.51, ARArtworkMasonryLayout2Column)),
                ArtworkWithImageAspectRatio(1),
                ArtworkWithImageAspectRatio(1),
            ]];
            expect(viewController.view).to.haveValidSnapshot();
        });

        describe(@"content overflow calculations", ^{
            __block id mockCollectionView;

            beforeEach(^{
                mockCollectionView = [OCMockObject mockForClass:[UICollectionView class]];
                viewController.activeModule = nil;
                viewController.collectionView = mockCollectionView;
            });

            it(@"indicates that content fills when it does", ^{
                CGSize contentSize = CGSizeMake(100, 101);
                CGRect bounds = CGRectMake(0, 0, 100, 100);

                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(contentSize)] contentSize];
                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(bounds)] bounds];

                expect([viewController currentContentFillsView]).to.beTruthy();
            });

            it(@"indicates that content fills when it barely does", ^{
                CGSize contentSize = CGSizeMake(100, 100);
                CGRect bounds = CGRectMake(0, 0, 100, 100);

                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(contentSize)] contentSize];
                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(bounds)] bounds];

                expect([viewController currentContentFillsView]).to.beTruthy();
                
            });

            it(@"indicates that content does not fill when it does not", ^{
                CGSize contentSize = CGSizeMake(100, 99);
                CGRect bounds = CGRectMake(0, 0, 100, 100);

                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(contentSize)] contentSize];
                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(bounds)] bounds];

                expect([viewController currentContentFillsView]).to.beFalsy();
            });
        });
    });

    describe(@"with horizontal rows", ^{
        beforeEach(^{
            viewController = AREmbeddedModelsViewControllerWithLayout(ARArtworkMasonryLayout2Row);
        });

        it(@"allows a trailing entry to the right to stick out if it sticks out <= 50% of its height", ^{
            [viewController appendItems:@[
                ArtworkWithImageAspectRatio(1),
                ArtworkWithImageAspectRatio(AspectRatioForMultiplier(1.5, ARArtworkMasonryLayout2Row)),
                ArtworkWithImageAspectRatio(1),
                ArtworkWithImageAspectRatio(1),
            ]];
            expect(viewController.view).to.haveValidSnapshot();
        });

        it(@"moves a trailing entry to the left if it would normally be at the right and stick out from the rest by more than 50% of its height", ^{
            [viewController appendItems:@[
                ArtworkWithImageAspectRatio(1),
                ArtworkWithImageAspectRatio(AspectRatioForMultiplier(1.51, ARArtworkMasonryLayout2Row)),
                ArtworkWithImageAspectRatio(1),
                ArtworkWithImageAspectRatio(1),
            ]];
            expect(viewController.view).to.haveValidSnapshot();
        });

        describe(@"content overflow calculations", ^{
            __block id mockCollectionView;

            beforeEach(^{
                mockCollectionView = [OCMockObject mockForClass:[UICollectionView class]];
                viewController.activeModule = nil;
                viewController.collectionView = mockCollectionView;
            });

            it(@"indicates that content fills when it does", ^{
                CGSize contentSize = CGSizeMake(101, 100);
                CGRect bounds = CGRectMake(0, 0, 100, 100);

                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(contentSize)] contentSize];
                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(bounds)] bounds];

                expect([viewController currentContentFillsView]).to.beTruthy();
            });

            it(@"indicates that content fills when it barely does", ^{
                CGSize contentSize = CGSizeMake(100, 100);
                CGRect bounds = CGRectMake(0, 0, 100, 100);

                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(contentSize)] contentSize];
                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(bounds)] bounds];

                expect([viewController currentContentFillsView]).to.beTruthy();

            });

            it(@"indicates that content does not fill when it does not", ^{
                CGSize contentSize = CGSizeMake(99, 100);
                CGRect bounds = CGRectMake(0, 0, 100, 100);

                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(contentSize)] contentSize];
                [[[mockCollectionView stub] andReturnValue:OCMOCK_VALUE(bounds)] bounds];
                
                expect([viewController currentContentFillsView]).to.beFalsy();
            });
        });
    });
});

SpecEnd
