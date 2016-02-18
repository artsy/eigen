#import "ARWorksForYouViewController.h"
#import "ARLabelSubclasses.h"

#import <ORStackView/ORStackView.h>


static NSString *ARArtworksByArtistCellIdentifier = @"ARArtworksByArtistCellIdentifier";


@interface ARWorksForYouViewController ()

@end


@implementation ARWorksForYouViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.view.backgroundColor = [UIColor whiteColor];

    // let's set up a stack
    ORStackView *stack = [[ORStackView alloc] initWithFrame:CGRectMake(0, 0, 320, 320)];
    [self.view addSubview:stack];

    ARSerifLabel *titleLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    // TODO: Localise / put strings elsewhere
    titleLabel.text = @"Works by artists you follow";
    titleLabel.textColor = [UIColor blackColor];

    [stack addSubview:titleLabel withTopMargin:@"40"];
}


@end
