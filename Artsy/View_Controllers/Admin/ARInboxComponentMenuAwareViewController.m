#import "ARInboxComponentMenuAwareViewController.h"


@interface ARInboxComponentMenuAwareViewController ()

@property (readwrite, nonatomic, assign) BOOL hidesBackButton;

@end


@implementation ARInboxComponentMenuAwareViewController

- (instancetype)initWithInbox;
{
    if ((self = [super initWithInbox])) {
        self.hidesBackButton = YES;
    }
    return self;
}


@end
