#import <UIKit/UIKit.h>

@interface ARMediaPreviewController : UIViewController
- (instancetype)initWithRemoteURL:(nonnull NSURL *)remoteURL
                         cacheKey:(nullable NSString *)cacheKey
                    fileExtension:(nullable NSString *)fileExtension;
@end
