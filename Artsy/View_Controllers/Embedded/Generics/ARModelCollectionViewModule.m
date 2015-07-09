#import "ARModelCollectionViewModule.h"


@implementation ARModelCollectionViewModule

// As the items & moduleLayout should be treated as
// properties by their subclasses we need to ensure
// that they are correctly set.

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _items = [NSArray array];
    return self;
}

- (UICollectionViewLayout *)moduleLayout;
{
    NSAssert(YES, @"moduleLayout not set on module subclass");
    return nil;
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{
}

- (Class)classForCell
{
    NSAssert(YES, @"class for cell not set on module subclass");
    return nil;
}

- (CGSize)intrinsicSize
{
    return (CGSize){240, 240};
}

- (ARFeedItemImageSize)imageSize
{
    return ARFeedItemImageSizeAuto;
}

@end
