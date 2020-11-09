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
    [self.stack.view alignTopEdgeWithView:self.flk_topLayoutGuide predicate:@"0"];
    [self.stack.view alignLeading:@"0" trailing:@"0" toView:self.view];
    CGFloat bottomInset = [UIApplication sharedApplication].keyWindow.safeAreaInsets.bottom;
    [self.stack.view alignBottomEdgeWithView:self.view predicate:[[NSNumber numberWithFloat:-bottomInset] stringValue]];
    self.view.backgroundColor = [UIColor whiteColor];
}

@end
