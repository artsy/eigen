#import "ARSignUpActiveUserViewController.h"

SpecBegin(ARSignUpActiveUserViewController);

__block ARSignUpActiveUserViewController *vc;

dispatch_block_t sharedBefore = ^{
    vc = [[ARSignUpActiveUserViewController alloc] init];
};

// Disabling all of this, considering we're moving away from Trial users.
// TODO: Will likely all be removed, but would like to do it together with the code.

//describe(@"sign up after app launch", ^{
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextFavoriteArtist", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextFavoriteArtist;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextFavoriteProfile", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextFavoriteProfile;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextFavoriteGene", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextFavoriteGene;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextFavoriteArtwork", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextFavoriteArtwork;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextShowingFavorites", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextShowingFavorites;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextPeriodical", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextPeriodical;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextRepresentativeInquiry", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextRepresentativeInquiry;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextContactGallery", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextContactGallery;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextAuctionBid", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextAuctionBid;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextArtworkOrder", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextArtworkOrder;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextFairGuide", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextFairGuide;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//
//    itHasSnapshotsForDevicesWithName(@"ARTrialContextNotTrial", ^{
//        sharedBefore();
//        vc.trialContext = ARTrialContextNotTrial;
//        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
//        return vc;
//    });
//});

SpecEnd;
