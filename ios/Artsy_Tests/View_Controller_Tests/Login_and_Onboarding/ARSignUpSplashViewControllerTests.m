#import "ARSignUpSplashViewController.h"
#import "ARCrossfadingImageView.h"


@interface ARSignUpSplashViewController ()
@property (nonatomic, strong, readwrite) UIPageControl *pageControl;
@property (nonatomic) ARCrossfadingImageView *imageView;
@end

SpecBegin(ARSignUpSplashViewController);

__block ARSignUpSplashViewController *controller;

dispatch_block_t sharedBefore = ^{
    controller = [[ARSignUpSplashViewController alloc] init];
};

describe(@"signup splash", ^{

    itHasSnapshotsForDevicesWithName(@"looks correct", ^{
        sharedBefore();
        [controller ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return controller;
    });
});

SpecEnd;
