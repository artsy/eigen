#import "ARInboxComponentViewController.h"
#import <React/RCTRootView.h>

@interface ARInboxComponentViewController ()

@end

@implementation ARInboxComponentViewController

- (instancetype)initWithInbox;
{
    if ((self = [super initWithEmission:nil
                             moduleName:@"Inbox"
                      initialProperties:nil])) {
    }
    return self;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    int somevar __attribute__((unused));

    #pragma clang diagnostic push
    #pragma clang diagnostic ignored "-Wunused-variable"
    RCTRootView *rootView = self.view.subviews.firstObject;
    #pragma clang diagnostic pop
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];

    #pragma clang diagnostic push
    #pragma clang diagnostic ignored "-Wunused-variable"
    RCTRootView *rootView = self.view.subviews.firstObject;
    #pragma clang diagnostic pop
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
