#import <UIKit/UIKit.h>

@class AREmission;

NS_ASSUME_NONNULL_BEGIN

@interface ARComponentViewController : UIViewController

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithNibName:(nullable NSString *)nibNameOrNil bundle:(nullable NSBundle *)nibBundleOrNil NS_UNAVAILABLE;
- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

// This will use the shared AREmission instance.
- (instancetype)initWithModuleName:(NSString *)moduleName;
- (instancetype)initWithEmission:(AREmission *)emission moduleName:(NSString *)moduleName NS_DESIGNATED_INITIALIZER;

@end

NS_ASSUME_NONNULL_END