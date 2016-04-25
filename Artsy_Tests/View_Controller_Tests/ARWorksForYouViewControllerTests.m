#import "ARWorksForYouViewController.h"
#import "ARStubbedWorksForYouNetworkModel.h"


@interface ARWorksForYouViewController ()
@property (nonatomic, strong, readwrite) id<ARWorksForYouNetworkModelable> worksForYouNetworkModel;
@end


SpecBegin(ARWorksForYouViewController);

__block ARWorksForYouViewController *subject;
__block ARStubbedWorksForYouNetworkModel *stubbedNetworkModel;

beforeEach(^{
    subject = [[ARWorksForYouViewController alloc] init];
    stubbedNetworkModel = [[ARStubbedWorksForYouNetworkModel alloc] init];
});

describe(@"visually", ^{
    it(@"looks right with one notification", ^{
        [stubbedNetworkModel stubNotificationItemWithNumberOfArtworks:2];
        subject.worksForYouNetworkModel = stubbedNetworkModel;

        /// This line has to be included for ORStackScrollView to record snapshots properly
        [subject ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        expect(subject).to.haveValidSnapshot();
    });

    it(@"looks right with several notifications", ^{
        [stubbedNetworkModel stubNotificationItemWithNumberOfArtworks:2];
        [stubbedNetworkModel stubNotificationItemWithNumberOfArtworks:1];
        subject.worksForYouNetworkModel = stubbedNetworkModel;
        
        // View controller containment doesn't work properly here unless we set the frame before beginAppearanceTransition
        subject.view.frame = [[UIScreen mainScreen] bounds];
        [subject beginAppearanceTransition:YES animated:NO];
        [subject endAppearanceTransition];
        
        expect(subject).to.haveValidSnapshot();
    });
});

describe(@"marking notifications as read", ^{
    it(@"sends a network request", ^{
        subject.worksForYouNetworkModel = stubbedNetworkModel;
        id networkModelStub = [OCMockObject partialMockForObject:subject.worksForYouNetworkModel];

        [[networkModelStub expect] markNotificationsRead];
        [subject beginAppearanceTransition:YES animated:NO];
        [subject endAppearanceTransition];
        [networkModelStub verify];
        [networkModelStub stopMocking];
    });

    it(@"tells the top menu vc to update its bell", ^{
        subject.worksForYouNetworkModel = stubbedNetworkModel;
        id topMenuStub = [OCMockObject partialMockForObject:[ARTopMenuViewController sharedController]];

        [[topMenuStub expect] setNotificationCount:0 forControllerAtIndex:ARTopTabControllerIndexNotifications];
        [subject beginAppearanceTransition:YES animated:NO];
        [subject endAppearanceTransition];
        [topMenuStub verify];
        [topMenuStub stopMocking];
    });
});

itHasSnapshotsForDevicesWithName(@"looks right when user has no notifications", ^{
    subject.worksForYouNetworkModel = stubbedNetworkModel;

    [subject ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
    return subject;
});

SpecEnd;
