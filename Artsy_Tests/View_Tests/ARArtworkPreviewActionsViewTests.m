#import "ARArtworkPreviewActionsView.h"
#import "ARHeartButton.h"
#import <Artsy-UIButtons/ARButtonSubclasses.h>


@interface ARArtworkPreviewActionsView (Testing)

- (void)buttonTapped:(id)sender;

@property (readwrite, nonatomic, strong) ARHeartButton *favoriteButton;
@property (readwrite, nonatomic, strong) ARCircularActionButton *shareButton;
@property (readwrite, nonatomic, strong) ARCircularActionButton *viewInRoomButton;
@property (readwrite, nonatomic, strong) ARCircularActionButton *viewInMapButton;
@end

SpecBegin(ARArtworkPreviewActionsView);

__block ARArtworkPreviewActionsView *subject;

beforeEach(^{
    subject = [[ARArtworkPreviewActionsView alloc] init];
});

describe(@"with a delegate set", ^{
    __block id delegateMock;

    beforeEach(^{
        delegateMock = [OCMockObject mockForProtocol:@protocol(ARArtworkPreviewActionsViewDelegate)];
        subject.delegate = delegateMock;
    });

    it(@"invokes delegate for when favourite button is tapped", ^{
        subject.favoriteButton = (id)[NSObject new];
        [[delegateMock expect] tappedArtworkFavorite:subject.favoriteButton];

        [subject buttonTapped:subject.favoriteButton];

        [delegateMock verify];
    });

    it(@"invokes delegate for when share button is tapped", ^{
        subject.shareButton = (id)[NSObject new];
        [[delegateMock expect] tappedArtworkShare:subject.shareButton];

        [subject buttonTapped:subject.shareButton];

        [delegateMock verify];
    });

    it(@"invokes delegate for when view in room button is tapped", ^{
        subject.viewInRoomButton = (id)[NSObject new];
        [[delegateMock expect] tappedArtworkViewInRoom];

        [subject buttonTapped:subject.viewInRoomButton];

        [delegateMock verify];
    });
});

SpecEnd;
