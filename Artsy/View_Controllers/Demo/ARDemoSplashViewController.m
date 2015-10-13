#import "ARDemoSplashViewController.h"

#import "ARFonts.h"

@interface ARDemoSplashViewController ()
@property (weak, nonatomic) IBOutlet UILabel *infoLabel;
@property (weak, nonatomic) IBOutlet UIImageView *backgroundImage;
@end


@implementation ARDemoSplashViewController

- (void)viewDidLoad
{
    self.backgroundImage.image = [UIImage imageNamed:@"Default"];
    self.backgroundImage.center = self.view.center;
    self.infoLabel.font = [UIFont serifFontWithSize:16];

    [super viewDidLoad];
}

@end
