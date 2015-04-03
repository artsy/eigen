#import <InterAppCommunication/IACManager.h>

@interface ARBackButtonCallbackManager : NSObject
@property (nonatomic, strong, readonly) IACSuccessBlock backBlock;
@property (nonatomic, weak, readonly) UIViewController *viewController;

- (instancetype)init __attribute__((unavailable("Designated Initializer initWithViewController:andBackBlock: must be used.")));
- (instancetype)initWithViewController:(UIViewController *)viewController andBackBlock:(IACSuccessBlock)backBlock;

- (BOOL)handleBackForViewController:(UIViewController *)viewController;
@end
