#import "UIViewController+Popovers.h"

@implementation UIViewController (Popovers)

// Popovers are deprecated but we're working around an iOS 9 bug, so silence the warning.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
- (void)ar_dismissPopovers
{
    // The bug we're working around has been fixed on iOS 10, and if this code were to run on iOS 10 it would crash the app.
    if ([[NSProcessInfo processInfo] isOperatingSystemAtLeastVersion:(NSOperatingSystemVersion){10, 0, 0}] == NO) {
        UIPopoverController *internalPopover = [self valueForKey:[NSString stringWithFormat:@"%@%@", @"_hidden", @"PopoverController"]];
        [internalPopover dismissPopoverAnimated:NO];
    }
}
#pragma clang diagnostic pop

@end
