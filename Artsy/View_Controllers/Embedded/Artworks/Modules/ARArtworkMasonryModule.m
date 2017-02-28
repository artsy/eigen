#import "ARArtworkMasonryModule.h"

#import "Artwork.h"
#import "ARReusableLoadingView.h"
#import "ARItemThumbnailViewCell.h"
#import "ARArtworkWithMetadataThumbnailCell.h"

#import "UIViewController+InnermostTopViewController.h"
#import "UIDevice-Hardware.h"


@interface ARArtworkMasonryModule ()
@property (nonatomic, strong) ARCollectionViewMasonryLayout *moduleLayout;
@property (nonatomic, assign) enum AREmbeddedArtworkPresentationStyle style;
@property (nonatomic, assign, getter=isHorizontal) BOOL horizontalOrientation;
@property (nonatomic, readonly, strong) ARReusableLoadingView *loadingView;
@property (nonatomic, readwrite) BOOL useLandscapeValues;
@end


@implementation ARArtworkMasonryModule

+ (instancetype)masonryModuleWithLayout:(enum ARArtworkMasonryLayout)layout andStyle:(enum AREmbeddedArtworkPresentationStyle)style;
{
    ARArtworkMasonryModule *module = [[self alloc] init];

    module.layout = layout;
    module.style = style;
    return module;
}


+ (instancetype)masonryModuleWithLayout:(enum ARArtworkMasonryLayout)layout;
{
    return [self masonryModuleWithLayout:layout andStyle:AREmbeddedArtworkPresentationStyleArtworkOnly];
}

+ (CGFloat)intrinsicHeightForHorizontalLayout:(ARArtworkMasonryLayout)layout useLandscapeValues:(BOOL)useLandscapeValues
{
    NSAssert([self.class layoutIsHorizontal:layout], @"intrinsicHeightForHorizontalLayout must be given a horizontal layout.");
    CGFloat height = [self dimensionForlayout:layout useLandscapeValues:useLandscapeValues];
    CGFloat margin = [self itemMarginsforLayout:layout].height;
    CGFloat rank = [self rankForlayout:layout];
    height = (rank * height) + ((rank - 1) * margin);
    return height;
}

+ (BOOL)layoutIsHorizontal:(ARArtworkMasonryLayout)layout
{
    switch (layout) {
        case ARArtworkMasonryLayout1Column:
        case ARArtworkMasonryLayout2Column:
        case ARArtworkMasonryLayout3Column:
        case ARArtworkMasonryLayout4Column:
            return NO;

        case ARArtworkMasonryLayout2Row:
        case ARArtworkMasonryLayout1Row:
            return YES;
    }
}

+ (NSInteger)rankForlayout:(ARArtworkMasonryLayout)layout
{
    switch (layout) {
        case ARArtworkMasonryLayout4Column:
            return 4;

        case ARArtworkMasonryLayout3Column:
            return 3;

        case ARArtworkMasonryLayout2Column:
        case ARArtworkMasonryLayout2Row:
            return 2;

        case ARArtworkMasonryLayout1Column:
        case ARArtworkMasonryLayout1Row:
            return 1;
    }
}

+ (CGFloat)dimensionForlayout:(ARArtworkMasonryLayout)layout useLandscapeValues:(BOOL)useLandscapeValues
{
    /// Returns the width of each column or height for each row, depending on the layout
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    CGFloat shortestDimension = MIN(CGRectGetWidth(screenRect), CGRectGetHeight(screenRect));

    switch (layout) {
        case ARArtworkMasonryLayout1Column:
            return shortestDimension - 40;

        case ARArtworkMasonryLayout2Column:
            // On iPad, the 2-column layout is only used in portrait mode.
            return [UIDevice isPad] ? 315 : shortestDimension / 2 - 30;

        case ARArtworkMasonryLayout3Column:
            // The 3-column layout is only used on iPad.
            NSAssert([UIDevice isPad], @"ARARtworkMasonryLayout3Column is intended for use with iPad");
            if (useLandscapeValues) {
                return 300;
            } else {
                return 215;
            }

        case ARArtworkMasonryLayout4Column:
            // The 4-column layout is only used in iPad landscape mode.
            NSAssert([UIDevice isPad], @"ARARtworkMasonryLayout4Column is intended for use with iPad");
            return 210;

        case ARArtworkMasonryLayout2Row:
            if ([UIDevice isPad]) {
                if (useLandscapeValues) {
                    return 184;
                } else {
                    return 134;
                }
            } else {
                return 120;
            }

        case ARArtworkMasonryLayout1Row:
            if ([UIDevice isPad]) {
                if (UIInterfaceOrientationIsPortrait([[UIApplication sharedApplication] statusBarOrientation])) {
                    return 400;
                } else {
                    return 400;
                }
            } else {
                return 240;
            }
    }
}

+ (UIEdgeInsets)edgeInsetsForlayout:(ARArtworkMasonryLayout)layout
{
    CGFloat inset = [UIDevice isPad] ? 50 : 20;
    switch (layout) {
        case ARArtworkMasonryLayout1Column:
        case ARArtworkMasonryLayout2Column:
        case ARArtworkMasonryLayout3Column:
        case ARArtworkMasonryLayout4Column:
            return (UIEdgeInsets){20, 0, 20, 0};

        case ARArtworkMasonryLayout1Row:
        case ARArtworkMasonryLayout2Row:
            return (UIEdgeInsets){0, inset, 0, inset};
    }
}

- (void)updateLayoutForSize:(CGSize)size
{
    self.useLandscapeValues = size.width > size.height;
    self.layout = (self.layoutProvider) ? [self.layoutProvider masonryLayoutForSize:size] : self.layout;
}

- (void)setLayout:(enum ARArtworkMasonryLayout)layout
{
    _layout = layout;
    [self setupWithLandscapeOrientation:self.useLandscapeValues];
}

- (CGSize)intrinsicSize
{
    CGSize screenSize = [[UIScreen mainScreen] bounds].size;
    CGFloat width = screenSize.width;
    CGFloat height;
    if ([self.class layoutIsHorizontal:self.layout]) {
        height = [self.class intrinsicHeightForHorizontalLayout:self.layout useLandscapeValues:self.useLandscapeValues];
    } else {
        NSMutableArray *lengths = [NSMutableArray array];
        for (Artwork *artwork in self.items) {
            CGFloat itemLength = [self.class variableDimensionForItem:artwork style:self.style layout:self.layout useLandscapeValues:self.useLandscapeValues];
            [lengths addObject:@(itemLength)];
        }

        height = [self.moduleLayout longestDimensionWithLengths:lengths withOppositeDimension:width];
    }
    return (CGSize){width, height};
}

- (Class)classForCell
{
    switch (self.style) {
        case AREmbeddedArtworkPresentationStyleArtworkOnly:
            return [ARItemThumbnailViewCell class];

        case AREmbeddedArtworkPresentationStyleArtworkMetadata:
            return [ARArtworkWithMetadataThumbnailCell class];
    }
}

- (void)setupWithLandscapeOrientation:(BOOL)useLandscapeValues
{
    self.horizontalOrientation = [self.class layoutIsHorizontal:self.layout];

    if (!self.moduleLayout) {
        self.moduleLayout = [[ARCollectionViewMasonryLayout alloc] initWithDirection:self.direction];
    }

    self.moduleLayout.itemMargins = [self.class itemMarginsforLayout:self.layout];
    self.moduleLayout.rank = [self.class rankForlayout:self.layout];
    self.moduleLayout.dimensionLength = [self.class dimensionForlayout:self.layout useLandscapeValues:useLandscapeValues];
    self.moduleLayout.contentInset = [self.class edgeInsetsForlayout:self.layout];
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(ARCollectionViewMasonryLayout *)collectionViewLayout variableDimensionForItemAtIndexPath:(NSIndexPath *)indexPath
{
    Artwork *item = self.items[indexPath.row];
    return [[self class] variableDimensionForItem:item style:self.style layout:self.layout useLandscapeValues:self.useLandscapeValues];
}

+ (CGFloat)variableDimensionForItem:(Artwork *)item style:(AREmbeddedArtworkPresentationStyle)style layout:(ARArtworkMasonryLayout)layout useLandscapeValues:(BOOL)useLandscapeValues
{
    CGFloat staticDimension = [self.class dimensionForlayout:layout useLandscapeValues:useLandscapeValues];
    CGFloat variableDimension = 0;

    // Set the artwork height/width for the artwork based on the layout
    BOOL isHorizontal = [[self class] layoutIsHorizontal:layout];
    if (style == AREmbeddedArtworkPresentationStyleArtworkMetadata && isHorizontal) {
        staticDimension -= [ARArtworkWithMetadataThumbnailCell heightForMetadataWithArtwork:item];
    }
    switch (layout) {
        case ARArtworkMasonryLayout1Column:
        case ARArtworkMasonryLayout2Column:
        case ARArtworkMasonryLayout3Column:
        case ARArtworkMasonryLayout4Column:
            variableDimension = staticDimension / item.aspectRatio;
            break;

        case ARArtworkMasonryLayout1Row:
        case ARArtworkMasonryLayout2Row:
            variableDimension = staticDimension * item.aspectRatio;
            break;
    }

    // Apply sizing offsets for the style
    switch (style) {
        case AREmbeddedArtworkPresentationStyleArtworkMetadata:
            if (!isHorizontal) {
                return variableDimension + [ARArtworkWithMetadataThumbnailCell heightForMetadataWithArtwork:item];
            }
            break;
        case AREmbeddedArtworkPresentationStyleArtworkOnly:
            break;
    }
    return variableDimension;
}

+ (CGSize)itemMarginsforLayout:(ARArtworkMasonryLayout)layout
{
    switch (layout) {
        case ARArtworkMasonryLayout1Column:
        case ARArtworkMasonryLayout2Column:
            if ([UIDevice isPad]) {
                return (CGSize){50, 38};
            }
        case ARArtworkMasonryLayout3Column:
            if ([UIDevice isPad]) {
                UIInterfaceOrientation orientation = [[UIApplication sharedApplication] statusBarOrientation];
                if (UIInterfaceOrientationIsLandscape(orientation)) {
                    return (CGSize){20, 20};
                } else {
                    return (CGSize){20, 20};
                }
            }
        case ARArtworkMasonryLayout4Column:
            if ([UIDevice isPad]) {
                return (CGSize){28, 28};
            }

        case ARArtworkMasonryLayout2Row:
        case ARArtworkMasonryLayout1Row:
            return (CGSize){15, 15};
    }
}

+ (BOOL)showPriceLabelForItem:(Artwork *)item
{
    return item.price.length && !item.isPriceHidden && item.sold.boolValue;
}

- (ARCollectionViewMasonryLayoutDirection)direction
{
    return (self.isHorizontal) ?
        ARCollectionViewMasonryLayoutDirectionHorizontal :
        ARCollectionViewMasonryLayoutDirectionVertical;
}

- (ARFeedItemImageSize)imageSize
{
    if ([UIDevice isPad] || self.layout == ARArtworkMasonryLayout1Column) {
        return ARFeedItemImageSizeLarge;
    } else if (self.isHorizontal) {
        return ARFeedItemImageSizeAuto;
    } else {
        return ARFeedItemImageSizeMasonry;
    }
}

- (void)setShowTrailingLoadingIndicator:(BOOL)showTrailingLoadingIndicator
{
    _showTrailingLoadingIndicator = showTrailingLoadingIndicator;
    if (showTrailingLoadingIndicator) {
        [self.loadingView startIndeterminateAnimated:YES];
    } else {
        [self.loadingView stopIndeterminateAnimated:YES];
    }
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(ARCollectionViewMasonryLayout *)collectionViewLayout dimensionForFooterAtIndexPath:(NSIndexPath *)indexPath
{
    return self.showTrailingLoadingIndicator ? 40 : 0;
}

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath
{
    if (!self.loadingView) {
        _loadingView = [[ARReusableLoadingView alloc] init];
        [self.loadingView startIndeterminateAnimated:YES];
    }
    return self.loadingView;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIDeviceOrientationDidChangeNotification object:nil];
}

@end
