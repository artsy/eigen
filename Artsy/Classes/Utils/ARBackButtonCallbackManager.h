#import <InterAppCommunication/IACManager.h>

@interface ARBackButtonCallbackManager : NSObject
@property (nonatomic, strong, readonly) void (^backBlock)(void) ;
@property (nonatomic, weak, readonly) UIViewController *viewController;

- (instancetype)init __attribute__((unavailable("Designated Initializer initWithViewController:andBackBlock: must be used.")));
- (instancetype)initWithViewController:(UIViewController *)viewController andBackBlock:(void(^)(void))backBlock;

- (BOOL)handleBackForViewController:(UIViewController *)viewController;
@end
