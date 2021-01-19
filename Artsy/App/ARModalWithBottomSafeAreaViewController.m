#import "ARModalWithBottomSafeAreaViewController.h"
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@implementation ARModalWithBottomSafeAreaViewController

- (instancetype)initWithStack:(UINavigationController *)stack
{
    self = [super init];
    _stack = stack;
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self addChildViewController:self.stack];
    [self.view addSubview:self.stack.view];
    
}

- (void)viewWillLayoutSubviews
{
    [super viewWillLayoutSubviews];
    UIEdgeInsets screenInsets = [UIApplication sharedApplication].keyWindow.safeAreaInsets;
    
    CGFloat top = self.modalPresentationStyle == UIModalPresentationFullScreen ? screenInsets.top : 0;
    self.additionalSafeAreaInsets = UIEdgeInsetsMake(top, screenInsets.left, screenInsets.bottom, screenInsets.right);
}

@end
