#import "ARSignUpSplashViewController.h"
#import "ARCrossfadingImageView.h"

@interface ARSignUpSplashViewController ()
@property (nonatomic, strong, readwrite) UIPageControl *pageControl;
@property (nonatomic) ARCrossfadingImageView *imageView;
@end

SpecBegin(ARSignUpSplashViewController)

__block ARSignUpSplashViewController *controller;

dispatch_block_t sharedBefore = ^{
    controller = [[ARSignUpSplashViewController alloc] init];
};

describe(@"signup splash", ^{

    it(@"has three pages", ^{
        sharedBefore();
        expect(controller.view).notTo.beNil();
        expect(controller.pageCount).to.equal(3);
        expect(controller.pageControl.numberOfPages).to.equal(3);
        expect([controller.imageView.images count]).to.equal(3);
    });

    itHasSnapshotsForDevicesWithName(@"looks correct", ^{
        sharedBefore();
        [controller ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return controller;
    });
});

SpecEnd
