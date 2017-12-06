#import "ARInboxComponentViewController.h"
#import <React/RCTRootView.h>

@interface ARInboxComponentViewController ()

@end

@implementation ARInboxComponentViewController

- (instancetype)initWithInbox;
{
    if ((self = [super initWithEmission:nil
                             moduleName:@"Inbox"
                      initialProperties:@{@"isVisible": @YES}])) {
    }
    return self;
}

@end
