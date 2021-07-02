#import <UIKit/UIKit.h>

@interface ARMediaPreviewController : NSObject

/// Attaches the controller to the hostViewController’s life-cycle, which takes care of memory management.
+ (nonnull instancetype)mediaPreviewControllerWithRemoteURL:(nonnull NSURL *)remoteURL
                                                   mimeType:(nonnull NSString *)mimeType
                                                   cacheKey:(nullable NSString *)cacheKey
                                         hostViewController:(nonnull UIViewController *)hostViewController
                                            originatingView:(nonnull UIView *)originatingView;

- (nonnull instancetype)initWithRemoteURL:(nonnull NSURL *)remoteURL
                                 mimeType:(nonnull NSString *)mimeType
                                 cacheKey:(nullable NSString *)cacheKey
                       hostViewController:(nonnull UIViewController *)hostViewController
                          originatingView:(nonnull UIView *)originatingView;

- (void)presentPreview;

@end
