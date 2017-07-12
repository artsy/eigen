#import <UIKit/UIKit.h>
#import "ARMenuAwareViewController.h"
#import <Emission/ARInboxComponentViewController.h>


@interface ARInboxComponentMenuAwareViewController : ARInboxComponentViewController <ARMenuAwareViewController>

- (instancetype)initWithInbox;

@end
