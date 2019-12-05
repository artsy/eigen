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

- (BOOL)shouldShowNewVersion;
{
    if ([AROptions boolForOption:AROptionsRNArtworkAlways]) {
        return YES;
    }

    BOOL isArtworkNonCommerical = self.artwork.availability != ARArtworkAvailabilityForSale && !self.artwork.isInquireable.boolValue;
    BOOL isArtworkAuctions = self.artwork.isInAuction;
    // Being in an auction excludes artworks from being NSOInquiry.
    BOOL isArtworkNSOInquiry = !isArtworkAuctions && (self.artwork.isOfferable.boolValue || self.artwork.isAcquireable.boolValue || self.artwork.isInquireable.boolValue);

    if (isArtworkNonCommerical) {
        return ([AROptions boolForOption:AROptionsRNArtworkNonCommerical] || [self.echo.features[@"ARReactNativeArtworkEnableNonCommercial"] state]);
    } else if (isArtworkNSOInquiry) {
        return ([AROptions boolForOption:AROptionsRNArtworkNSOInquiry] || [self.echo.features[@"ARReactNativeArtworkEnableNSOInquiry"] state]);
    } else if (isArtworkAuctions) {
        return ([AROptions boolForOption:AROptionsRNArtworkAuctions] || [self.echo.features[@"ARReactNativeArtworkEnableAuctions"] state]);
    }

    return NO;
}

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

            if (sself.shouldShowNewVersion) {
                ARArtworkComponentViewController *vc = [[ARArtworkComponentViewController alloc] initWithArtworkID:sself.artwork.artworkID];
                [sself ar_addAlignedModernChildViewController:vc];
            } else {
                // Pass a copy of the artwork instance here, because we don’t want our
                // artwork's onArtworkUpdate deferred callback to be triggered again.
                sself.legacyViewController = [[ARLegacyArtworkViewController alloc] initWithArtwork:[sself.artwork copy]
                                                                                               fair:sself.fair];
                [sself ar_addAlignedModernChildViewController:sself.legacyViewController];

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
