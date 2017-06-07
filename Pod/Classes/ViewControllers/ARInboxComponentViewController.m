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

    RCTRootView *rootView = self.view.subviews.firstObject;
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];

    RCTRootView *rootView = self.view.subviews.firstObject;
}


@end
