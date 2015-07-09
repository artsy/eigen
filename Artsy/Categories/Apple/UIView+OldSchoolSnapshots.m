#import "UIView+OldSchoolSnapshots.h"


@implementation UIView (OldSchoolSnapshots)

- (UIView *)ar_snapshot
{
    UIGraphicsBeginImageContextWithOptions(self.bounds.size, NO, 0);

    CGContextRef context = UIGraphicsGetCurrentContext();
    [self.layer renderInContext:context];
    UIImage *snapshotImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    return [[UIImageView alloc] initWithImage:snapshotImage];
}

@end
