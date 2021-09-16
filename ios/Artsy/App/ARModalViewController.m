#import "ARModalViewController.h"
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <Emission/AREmission.h>

@implementation ARModalViewController

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

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    if(self.isBeingDismissed){
        [AREmission.sharedInstance.notificationsManagerModule modalDismissed];
    }
}

@end
