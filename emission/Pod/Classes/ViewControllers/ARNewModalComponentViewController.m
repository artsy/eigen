#import "ARNewModalComponentViewController.h"

// Normally, we would wrap this in a SerifNavigationController to opt it
// into a modal presentation (using presentModalViewController) and to
// give it a standard close button. But the design in MX-384 shows
// different close buttons.

@implementation ARNewModalComponentViewController

- (instancetype)init
{
  return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(AREmission *)emission
{
    return [super initWithEmission:emission
                        moduleName:@"NewModal"
                 initialProperties:@{}];
}

- (void)viewDidLoad {
    [super viewDidLoad];

    // Neccary to not show bottom grey bar on iPhone X
    self.view.backgroundColor = [UIColor whiteColor];
}

- (BOOL)newModalStyle {
    return YES;
}

@end
