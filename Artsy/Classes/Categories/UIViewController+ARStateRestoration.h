#import <UIKit/UIKit.h>

@interface UIViewController (ARStateRestoration)

/// Automatic setup of the restoration identifier and class
/// based on the class of the View Controller instance

- (void)setupRestorationIdentifierAndClass;

@end
