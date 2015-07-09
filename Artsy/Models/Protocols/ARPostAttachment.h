#import <Foundation/Foundation.h>

@protocol ARPostAttachment <NSObject>

- (NSURL *)urlForThumbnail;
- (CGFloat)aspectRatio;
- (CGSize)maxSize;

@end
