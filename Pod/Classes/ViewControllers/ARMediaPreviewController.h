#import <UIKit/UIKit.h>

@interface ARMediaPreviewController : UIViewController
- (instancetype)initWithRemoteURL:(nonnull NSURL *)remoteURL
                         mimeType:(nonnull NSString *)mimeType
                         cacheKey:(nullable NSString *)cacheKey;
@end
