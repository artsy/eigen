#import "ARPendingOperationViewController.h"
#import "ARSpinner.h"


@interface ARPendingOperationViewController (Testing)

@property (nonatomic, strong) UILabel *label;
@property (nonatomic, strong) ARSpinner *spinner;

@end

SpecBegin(ARPendingOperationViewController);

it(@"has a valid snapshot", ^{
    ARPendingOperationViewController *viewController = [[ARPendingOperationViewController alloc] init];
    viewController.view.frame = [[UIScreen mainScreen] bounds];
    [viewController.spinner.layer removeAllAnimations];

    expect(viewController).to.haveValidSnapshot();
});

it(@"has a default message", ^{
    ARPendingOperationViewController *viewController = [[ARPendingOperationViewController alloc] init];
    expect(viewController.message).to.equal(@"locating...");
});

it(@"binds message to the label's text", ^{
    NSString *message = @"Hail Cthulhu";
    
    ARPendingOperationViewController *viewController = [[ARPendingOperationViewController alloc] init];
    viewController.message = message;

    // load view
    expect(viewController.view).notTo.beNil();
    expect(viewController.label.text).to.equal(message);
});

SpecEnd;
