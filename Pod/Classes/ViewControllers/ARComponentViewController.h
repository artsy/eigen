#import <UIKit/UIKit.h>

@class AREmission;
@class RCTRootView;

NS_ASSUME_NONNULL_BEGIN

@interface ARComponentViewController : UIViewController

@property (nonatomic, strong) RCTRootView *rootView;

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithNibName:(nullable NSString *)nibNameOrNil bundle:(nullable NSBundle *)nibBundleOrNil NS_UNAVAILABLE;
- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_DESIGNATED_INITIALIZER;

@end

NS_ASSUME_NONNULL_END
