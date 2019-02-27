#import "ARArtworkPreviewActionsView.h"

#import "Artwork.h"
#import "ARHeartButton.h"
#import "Fair.h"

#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

const CGFloat ARArtworkActionButtonSpacing = 8;
const CGFloat ARArtworkActionButtonNoCircleSpacing = 30;

@interface ARArtworkPreviewActionsView ()

/// The button for indicating you're favoriting a work
@property (readwrite, nonatomic, strong) ARHeartButton *favoriteButton;

/// The button for sharing a work over airplay / twitter / fb
@property (readwrite, nonatomic, strong) ARCircularActionButton *shareButton;

/// The button for viewing a room, initially hidden, only available
/// if the Artwork can be viewed in a room.
@property (readwrite, nonatomic, strong) ARCircularActionButton *viewInRoomButton;

/// The button for showing the map, initially hidden, only available
/// if in a fair context
@property (readwrite, nonatomic, strong) ARCircularActionButton *viewInMapButton;
@end


@implementation ARArtworkPreviewActionsView

- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair modern:(BOOL)modern
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _modern = modern;
    _shareButton = [self newShareButton];
    _favoriteButton = [self newFavoriteButton];

   __weak typeof (self) wself = self;
    [artwork getFavoriteStatus:^(ARHeartStatus status) {
        __strong typeof (wself) sself = wself;
        [sself.favoriteButton setStatus:status animated:YES];
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        [sself.favoriteButton setStatus:ARHeartStatusNo animated:YES];
    }];

    [artwork onArtworkUpdate:^{
        __strong typeof (wself) sself = wself;
        [sself updateWithArtwork:artwork andFair:fair];
    } failure:nil];

    return self;
}

- (ARHeartButton *)newFavoriteButton
{
    ARHeartButton *button = [[ARHeartButton alloc] init];
    [button setBordered:!self.modern];

    [self addSubview:button];
    button.accessibilityIdentifier = @"Favorite Artwork";
    [button addTarget:self action:@selector(buttonTapped:) forControlEvents:UIControlEventTouchUpInside];

    if (self.modern) {
        button.layer.borderWidth = 0;
    }

    return button;
}

- (ARCircularActionButton *)newShareButton
{
    return [self buttonWithName:@"Artwork_Icon_Share" identifier:@"Share Artwork"];
}

- (ARCircularActionButton *)newViewInRoomButton
{
    return [self buttonWithName:@"Artwork_Icon_VIR" identifier:@"View Artwork in Room"];
}

- (ARCircularActionButton *)newMapButton
{
    return [self buttonWithName:@"MapButtonAction" identifier:@"Show the map"];
}

- (ARCircularActionButton *)buttonWithName:(NSString *)name identifier:(NSString *)identifier
{
    ARCircularActionButton *button = [[ARCircularActionButton alloc] initWithImageName:name];
    [self addSubview:button];
    button.accessibilityIdentifier = identifier;
    [button addTarget:self action:@selector(buttonTapped:) forControlEvents:UIControlEventTouchUpInside];

    if (self.modern) {
        button.layer.borderWidth = 0;
    }
    return button;
}

- (void)buttonTapped:(id)sender
{
    if (sender == self.shareButton) {
        [self.delegate tappedArtworkShare:sender];
    } else if (sender == self.favoriteButton) {
        [self.delegate tappedArtworkFavorite:sender];
    } else if (sender == self.viewInRoomButton) {
        [self.delegate tappedArtworkViewInRoom];
    }
}

- (void)toggleViewInRoomButton:(BOOL)show
{
    // Return if there is nothing to change
    if (show == (self.viewInRoomButton != nil)) {
        return;
    }

    if (show) {
        self.viewInRoomButton = [self newViewInRoomButton];
        // TODO do once?
        [self.delegate showInformationBannerForVIR:self.viewInRoomButton];

    } else {
        [self.viewInRoomButton removeFromSuperview];
        self.viewInRoomButton = nil;
    }
    [self setNeedsUpdateConstraints];
}

- (void)toggleMapButton:(BOOL)show
{
    // Return if there is nothing to change
    if (show == (self.viewInMapButton != nil)) {
        return;
    }

    if (show) {
        self.viewInRoomButton = [self newMapButton];
    } else {
        [self.viewInMapButton removeFromSuperview];
        self.viewInMapButton = nil;
    }

    [self setNeedsUpdateConstraints];
}

- (void)updateWithArtwork:(Artwork *)artwork andFair:(Fair *)fair
{
    BOOL canDisplayViewInRoom = [UIDevice isPhone];
    BOOL showViewInRoom = canDisplayViewInRoom && artwork.canViewInRoom;

    [self toggleViewInRoomButton:showViewInRoom];
}

- (void)updateConstraints
{
    [super updateConstraints];

    [self removeConstraints:self.constraints];

    NSMutableArray *buttons = [NSMutableArray array];

    if (self.viewInMapButton) {
        [buttons addObject:self.viewInMapButton];
    }

    if (self.viewInRoomButton) {
        [buttons addObject:self.viewInRoomButton];
    }

    [buttons addObjectsFromArray:@[ self.favoriteButton, self.shareButton ]];

    if (buttons.count > 0) {
        CGFloat margin = self.modern ? ARArtworkActionButtonNoCircleSpacing : ARArtworkActionButtonSpacing;
        [UIView spaceOutViewsHorizontally:buttons predicate:@(margin).stringValue];
        [(UIView *)[buttons firstObject] alignLeadingEdgeWithView:self predicate:@"0"];
        [(UIView *)[buttons lastObject] alignTrailingEdgeWithView:self predicate:@"0"];
        [UIView alignTopAndBottomEdgesOfViews:[buttons arrayByAddingObject:self]];
    }
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){UIViewNoIntrinsicMetric, 48};
}

@end
