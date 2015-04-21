#import "ARArtworkPreviewActionsView.h"
#import "ARHeartButton.h"

const CGFloat ARArtworkActionButtonSpacing = 8;

@interface ARArtworkPreviewActionsView()

/// The button for indicating you're favoriting a work
@property (readonly, nonatomic, strong) ARHeartButton *favoriteButton;

/// The button for sharing a work over airplay / twitter / fb
@property (readonly, nonatomic, strong) ARCircularActionButton *shareButton;

/// The button for viewing a room, initially hidden, only available
/// if the Artwork can be viewed in a room.
@property (readwrite, nonatomic, strong) ARCircularActionButton *viewInRoomButton;

/// The button for showing the map, initially hidden, only available
/// if in a fair context
@property (readwrite, nonatomic, strong) ARCircularActionButton *viewInMapButton;
@end

@implementation ARArtworkPreviewActionsView

- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair
{
    self = [super init];
    if (!self) { return nil; }
    
    _shareButton = [self newShareButton];
    _favoriteButton = [self newFavoriteButton];

    @weakify(self);
    [artwork getFavoriteStatus:^(ARHeartStatus status) {
        @strongify(self);
        [self.favoriteButton setStatus:status animated:YES];
    } failure:^(NSError *error) {
        @strongify(self);
        [self.favoriteButton setStatus:ARHeartStatusNo animated:YES];
    }];

    [artwork onArtworkUpdate:^{
        @strongify(self);
        [self updateWithArtwork:artwork andFair:fair];
    } failure:nil];

    return self;
}

- (ARHeartButton *)newFavoriteButton
{
    ARHeartButton *button = [[ARHeartButton alloc] init];
    [self addSubview:button];
    button.accessibilityIdentifier = @"Favorite Artwork";
    [button addTarget:nil action:@selector(tappedArtworkFavorite:) forControlEvents:UIControlEventTouchUpInside];
    return button;
}

- (ARCircularActionButton *)newShareButton
{
    return[self buttonWithName:@"Artwork_Icon_Share" identifier:@"Share Artwork" action:@selector(tappedArtworkShare:)];
}

- (ARCircularActionButton *)newViewInRoomButton
{
    return [self buttonWithName:@"Artwork_Icon_VIR" identifier:@"View Artwork in Room" action:@selector(tappedArtworkViewInRoom:)];
}

- (ARCircularActionButton *)newMapButton
{
    return [self buttonWithName:@"MapButtonAction" identifier:@"Show the map" action:@selector(tappedArtworkViewInMap:)];
}

- (ARCircularActionButton *)buttonWithName:(NSString *)name identifier:(NSString *)identifier action:(SEL)action
{
    ARCircularActionButton *button = [[ARCircularActionButton alloc] initWithImageName:name];
    [self addSubview:button];
    button.accessibilityIdentifier = identifier;
    [button addTarget:nil action:action forControlEvents:UIControlEventTouchUpInside];
    return button;
}

- (void)updateWithArtwork:(Artwork *)artwork andFair:(Fair *)fair
{
    if ([UIDevice isPhone]) {
        if (artwork.canViewInRoom) {
            if (!self.viewInRoomButton) {
                self.viewInRoomButton = [self newViewInRoomButton];
                [self setNeedsUpdateConstraints];
            }
    
        } else if (self.viewInRoomButton) {
            [self.viewInRoomButton removeFromSuperview];
            self.viewInRoomButton = nil;
            [self setNeedsUpdateConstraints];
        }
        
        if (fair) {
            void(^revealMapButton)(NSArray *) = ^(NSArray *maps) {
                if (maps.count > 0) {
                    if (!self.viewInMapButton) {
                        self.viewInMapButton = [self newMapButton];
                        [self setNeedsUpdateConstraints];
                    }
                    
                } else if (self.viewInMapButton) {
                    [self.viewInMapButton removeFromSuperview];
                    self.viewInMapButton = nil;
                    [self setNeedsUpdateConstraints];
                }
            };
            
            if (fair.maps.count > 0) {
                revealMapButton(fair.maps);
            } else {
                [fair getFairMaps:revealMapButton];
            }
        }
    }
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
    
    [buttons addObjectsFromArray:@[self.favoriteButton, self.shareButton]];
    
    if (buttons.count > 0) {
        [UIView spaceOutViewsHorizontally:buttons predicate:@(ARArtworkActionButtonSpacing).stringValue];
        [(UIView *)[buttons firstObject] alignLeadingEdgeWithView:self predicate:@"0"];
        [(UIView *)[buttons lastObject] alignTrailingEdgeWithView:self predicate:@"0"];
        [UIView alignTopAndBottomEdgesOfViews:[buttons arrayByAddingObject:self]];
    }
}

- (CGSize)intrinsicContentSize
{
    return (CGSize) { UIViewNoIntrinsicMetric , 48 };
}

@end
