#import "ARArtworkViewController.h"
#import "ARLegacyArtworkViewController.h"
#import "Artwork.h"
#import "ARDispatchManager.h"
#import "ARSpinner.h"
#import "AROptions.h"
#import "ArtsyEcho.h"
#import "ARSwitchboard.h"
#import "UIDevice-Hardware.h"
#import "UIViewController+SimpleChildren.h"

#import <Emission/ARArtworkComponentViewController.h>

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARArtworkViewController ()
@property (strong, nonatomic) ARLegacyArtworkViewController *legacyViewController;
@property (strong, nonatomic) ARSpinner *spinner;
@property (strong, nonatomic) Aerodramus *echo;
@end


@implementation ARArtworkViewController

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair;
{
    if ((self = [super init])) {
        _artwork = artwork;
        _fair = fair;
        _echo = [[ARSwitchBoard sharedInstance] echo];
    }
    return self;
}

- (void)loadView;
{
    self.view = [UIView new];

    ARSpinner *spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
    [spinner fadeInAnimated:NO];
    [spinner constrainHeight:@"100"];
    [self.view addSubview:spinner];
    [spinner alignCenterWithView:self.view];
    self.spinner = spinner;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];

    __weak typeof(self) wself = self;

    [self.artwork onArtworkUpdate:^{
        ar_dispatch_main_queue(^{
            NSAssert(wself, @"Did not expect the VC to have been released.");
            if (!wself) {
                return;
            }
            __strong typeof(wself) sself = wself;

            [sself.spinner stopAnimating];
            [sself.spinner removeFromSuperview];

            ARArtworkComponentViewController *vc = [[ARArtworkComponentViewController alloc] initWithArtworkID:sself.artwork.artworkID];
            [sself ar_addAlignedModernChildViewController:vc];
        });
    } failure:^(NSError *error) {
        // TODO
        NSLog(@"FAILED TO UPDATE: %@", error);
    }];

    [self.artwork updateArtwork];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations;
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

- (UIImageView *)imageView;
{
    return self.legacyViewController.imageView;
}

- (void)setHasFinishedScrolling;
{
    [self.legacyViewController setHasFinishedScrolling];
}

- (CGPoint)imageViewOffset;
{
    return self.legacyViewController.imageViewOffset;
}

@end
