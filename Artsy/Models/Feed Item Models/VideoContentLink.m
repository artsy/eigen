#import "VideoContentLink.h"

@implementation VideoContentLink

- (CGFloat)aspectRatio {
    if (!self.thumbnailHeight || !self.thumbnailWidth) {
        return 1;
    }
    return (CGFloat)self.thumbnailWidth/self.thumbnailHeight;
}

- (CGSize)maxSize {
    if (!self.thumbnailHeight || !self.thumbnailWidth) {
        return CGSizeZero;
    }
    return CGSizeMake(self.thumbnailWidth, self.thumbnailHeight);
}

- (NSURL *)urlForThumbnail {
    return [NSURL URLWithString: self.thumbnailUrl];
}

@end
