#import "ARBackButtonCallbackManager.h"

@implementation ARBackButtonCallbackManager

- (instancetype)initWithViewController:(UIViewController *)viewController andBackBlock:(void(^)(void))backBlock
{
    self = [super init];
    if (!self) { return nil; }

    _viewController = viewController;
    _backBlock = backBlock;

    return self;
}

- (BOOL)canHandleBackForViewController:(UIViewController *)viewController;
{
    return (self.viewController && self.viewController == viewController);
}

- (BOOL)handleBackForViewController:(UIViewController *)viewController;
{
    if (![self canHandleBackForViewController:viewController]) { return NO; };
    self.backBlock();
    return YES;
}

@end
