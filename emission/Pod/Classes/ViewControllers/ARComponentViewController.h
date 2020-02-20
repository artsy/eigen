#import <UIKit/UIKit.h>

@class AREmission;
@class RCTRootView;

NS_ASSUME_NONNULL_BEGIN

/// A way of letting consumers of Emission know that this View Controller
/// needs to be treated a little differently with positioning
@protocol ARComponentFullBleedViewSizing <NSObject>

@property (nonatomic, readonly) BOOL fullBleed;
@property (nonatomic, readonly) BOOL shouldInjectSafeAreaInsets;

@end


/// The base subclass for any UIViewController that wraps a React Native root view
@interface ARComponentViewController : UIViewController <ARComponentFullBleedViewSizing>

/// The React View
@property (nonatomic, strong) RCTRootView *rootView;

// If set to true, the view controller will start under th status bar (iPhone X, iPad Pro, etc...)
@property (nonatomic, assign) BOOL fullBleed;

// If set to true, the root RN component will have props injected for the safe area insets
@property (nonatomic, assign) BOOL shouldInjectSafeAreaInsets;

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithNibName:(nullable NSString *)nibNameOrNil bundle:(nullable NSBundle *)nibBundleOrNil NS_UNAVAILABLE;
- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_DESIGNATED_INITIALIZER;

/// This sets a prop on the rootView, or sets a prop to be passed in on rootView initialization.
- (void)setProperty:(id)value forKey:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
