#import "ARMessagesComponentViewController.h"
#import <React/RCTRootView.h>

@interface ARMessagesComponentViewController ()

@end

@implementation ARMessagesComponentViewController

- (instancetype)initWithMessages;
{
    if ((self = [super initWithEmission:nil
                             moduleName:@"Messages"
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
