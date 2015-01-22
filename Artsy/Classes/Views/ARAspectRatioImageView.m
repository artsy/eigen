#import "ARAspectRatioImageView.h"

@implementation ARAspectRatioImageView

- (CGSize)intrinsicContentSize
{
    if (self.image.size.width == 0) {
        return (CGSize) { UIViewNoIntrinsicMetric, UIViewNoIntrinsicMetric };
    } else {
        CGFloat imageRatio = self.image.size.height / self.image.size.width;
        return CGSizeMake(CGRectGetWidth(self.bounds), CGRectGetWidth(self.bounds) * imageRatio);
    }
}

@end
