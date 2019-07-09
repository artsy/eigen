#import "ARArtworkViewController.h"
#import "ARLegacyArtworkViewController.h"
#import "Artwork.h"
#import "ARDispatchManager.h"
#import "ARSpinner.h"
#import "AROptions.h"

#import <Emission/ARArtworkComponentViewController.h>

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARArtworkViewController ()
@property (strong, nonatomic) ARLegacyArtworkViewController *legacyViewController;
@property (strong, nonatomic) ARSpinner *spinner;
@end


@implementation ARArtworkViewController

- (BOOL)shouldShowNewVersion;
{
    return [AROptions boolForOption:AROptionsRNArtwork] && self.artwork.availability != ARArtworkAvailabilityForSale && !self.artwork.isInquireable.boolValue;
}

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair;
{
    if ((self = [super init])) {
        _artwork = artwork;
        _fair = fair;
    }
    return self;
}

- (void)loadView;
{
    self.view = [UIView new];

    ARSpinner *spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
    [spinner fadeInAnimated:ARPerformWorkAsynchronously];
    [spinner constrainHeight:@"100"];
    [self.view addSubview:spinner];
    [spinner alignCenterWithView:self.view];
    self.spinner = spinner;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

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

      if (sself.shouldShowNewVersion) {
        ARArtworkComponentViewController *vc = [[ARArtworkComponentViewController alloc] initWithArtworkID:sself.artwork.artworkID];
        [sself addChildViewController:vc];
        [sself.view addSubview:vc.view];
        [vc.view alignToView:sself.view];
      } else {
        // Pass a copy of the artwork instance here, because we don’t want our
        // artwork's onArtworkUpdate deferred callback to be triggered again.
        sself.legacyViewController = [[ARLegacyArtworkViewController alloc] initWithArtwork:[sself.artwork copy]
                                                                                       fair:sself.fair];
        [sself addChildViewController:sself.legacyViewController];
        [sself.view addSubview:sself.legacyViewController.view];
        [sself.legacyViewController.view alignToView:sself.view];

        // This replicates what previously the ARArtworkSetViewController would invoke on the legacy VC,
        // which in turn ends up invoking -setupUI and render everything below the fold.
        [sself.legacyViewController setHasFinishedScrolling];
      }
    });
    } failure:^(NSError *error) {
    // TODO
    NSLog(@"FAILED TO UPDATE: %@", error);
    }];

    [self.artwork updateArtwork];
}

- (NSInteger)index;
{
    return self.legacyViewController.index;
}

- (void)setIndex:(NSInteger)index;
{
    self.legacyViewController.index = index;
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
