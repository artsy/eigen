#import <UIKit/UIKit.h>
#import <React/RCTRootView.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARComponentViewController : UIViewController

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithNibName:(NSString * _Nullable)nibNameOrNil bundle:(NSBundle * _Nullable)nibBundleOrNil NS_UNAVAILABLE;
- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

- (instancetype)initWithBridge:(RCTBridge *)bridge moduleName:(NSString *)moduleName NS_DESIGNATED_INITIALIZER;

@end

NS_ASSUME_NONNULL_END