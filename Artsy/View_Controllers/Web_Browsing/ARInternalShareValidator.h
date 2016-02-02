#import <UIKit/UIKit.h>

/// Handles hitting share buttons inside InternalWebViewControllers


@interface ARInternalShareValidator : NSObject

/// Checks if the URL is a share URL
- (BOOL)isSocialSharingURL:(NSURL *)url;

/// Checks if the URL is a facebook share URL
- (BOOL)isFacebookShareURL:(NSURL *)url;

/// Checks if the URL is a twitter share URL
- (BOOL)isTwitterShareURL:(NSURL *)url;

/// Pulls out the address of the URL being shared
- (NSString *)addressBeingSharedFromShareURL:(NSURL *)url;

/// Pulls out the name of the URL being shared
- (NSString *)nameBeingSharedInURL:(NSURL *)url;

/// Shares the URL, presenting a UI within a view
/// Frame is only needed on iPad to present a popover.
/// On other platforms, the frame is ignored.
- (void)shareURL:(NSURL *)url inView:(UIView *)view frame:(CGRect)frame;

@end
