#import "ARSignUpActiveUserViewController.h"

SpecBegin(ARSignUpActiveUserViewController)

__block ARSignUpActiveUserViewController *vc;

dispatch_block_t sharedBefore = ^{
    vc = [[ARSignUpActiveUserViewController alloc] init];
    vc.shouldAnimate = NO;
};

describe(@"sign up after app launch", ^{
    itHasSnapshotsForDevices(@"ARTrialContextFavoriteArtist", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextFavoriteArtist;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextFavoriteProfile", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextFavoriteProfile;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextFavoriteGene", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextFavoriteGene;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextFavoriteArtwork", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextFavoriteArtwork;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextShowingFavorites", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextShowingFavorites;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextPeriodical", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextPeriodical;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextRepresentativeInquiry", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextRepresentativeInquiry;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextContactGallery", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextContactGallery;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextAuctionBid", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextAuctionBid;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextArtworkOrder", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextArtworkOrder;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextFairGuide", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextFairGuide;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });

    itHasSnapshotsForDevices(@"ARTrialContextNotTrial", ^{
        sharedBefore();
        vc.trialContext = ARTrialContextNotTrial;
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        return vc;
    });
});

SpecEnd