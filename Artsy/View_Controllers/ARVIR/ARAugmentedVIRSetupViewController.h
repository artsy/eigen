#import <UIKit/UIKit.h>
@class ARAugmentedRealityConfig;

@interface ARAugmentedVIRSetupViewController : UIViewController

- (instancetype)initWithMovieURL:(NSURL *)movieURL config:(ARAugmentedRealityConfig *)config;

/// Is AR even supported?
+ (BOOL)canOpenARView;
/// Have they already given access, and placed a work?
+ (BOOL)canSkipARSetup:(NSUserDefaults *)defaults;
/// Request access
+ (void)validateAVAccess:(NSUserDefaults *)defaults callback:(void (^)(bool allowedAccess))closure;
@end
