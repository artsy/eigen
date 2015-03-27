#import "ARArtworkPreviewActionsView.h"
#import "ARHeartButton.h"

@interface ARArtworkPreviewActionsView()
@property (readwrite, nonatomic, strong) NSLayoutConstraint *mapButtonConstraint;
@end

@implementation ARArtworkPreviewActionsView

- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair
{
    self = [super init];
    if (!self) { return nil; }

    _shareButton = [[ARCircularActionButton alloc] initWithImageName:@"Artwork_Icon_Share"];
    _favoriteButton = [[ARHeartButton alloc] init];
    _viewInRoomButton = [[ARCircularActionButton alloc] initWithImageName:@"Artwork_Icon_VIR"];
    _viewInMapButton = [[ARCircularActionButton alloc] initWithImageName:@"MapButtonAction"];

    [@[_viewInMapButton, _viewInRoomButton] each:^(UIButton *button) {
        button.alpha = 0;
        button.enabled = NO;
    }];

    self.shareButton.accessibilityIdentifier = @"Share Artwork";
    self.favoriteButton.accessibilityIdentifier = @"Favorite Artwork";
    self.viewInRoomButton.accessibilityIdentifier = @"View Artwork in Room";
    self.viewInMapButton.accessibilityIdentifier = @"Show the map";

    [self addSubview:self.shareButton];
    [self addSubview:self.favoriteButton];

    ARThemeLayoutVendor *layout = [ARTheme themeNamed:@"Artwork"].layout;

    if ([UIDevice isPad]) {
        [self.favoriteButton alignCenterXWithView:self predicate:@"-32"];
        [self.shareButton alignCenterXWithView:self predicate:@"32"];
    } else {
        // right aligned with VIR

        [self addSubview:self.viewInRoomButton];

        [self.shareButton alignTrailingEdgeWithView:self predicate:@"0"];
        [self.favoriteButton alignAttribute:NSLayoutAttributeTrailing toAttribute:NSLayoutAttributeLeading ofView:_shareButton predicate:layout[@"ButtonMargin"]];
        [self.viewInRoomButton alignAttribute:NSLayoutAttributeTrailing toAttribute:NSLayoutAttributeLeading ofView:_favoriteButton predicate:layout[@"ButtonMargin"]];

        [self addSubview:self.viewInMapButton];

        self.mapButtonConstraint = [[_viewInMapButton alignAttribute:NSLayoutAttributeTrailing toAttribute:NSLayoutAttributeLeading ofView:_viewInRoomButton predicate:layout[@"ButtonMargin"]] firstObject];
    }


    for (UIView *view in @[self.shareButton, self.favoriteButton, self.viewInRoomButton, self.viewInMapButton]) {
        [view alignTopEdgeWithView:self predicate:@"0"];
    }

    [self.shareButton addTarget:nil action:@selector(tappedArtworkShare:) forControlEvents:UIControlEventTouchUpInside];
    [self.favoriteButton addTarget:nil action:@selector(tappedArtworkFavorite:) forControlEvents:UIControlEventTouchUpInside];
    [self.viewInRoomButton addTarget:nil action:@selector(tappedArtworkViewInRoom:) forControlEvents:UIControlEventTouchUpInside];
    [self.viewInMapButton addTarget:nil action:@selector(tappedArtworkViewInMap:) forControlEvents:UIControlEventTouchUpInside];

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

- (void)updateWithArtwork:(Artwork *)artwork andFair:(Fair *)fair
{
    if (artwork.canViewInRoom) {
        [UIView animateWithDuration:ARAnimationQuickDuration animations:^{
            self.viewInRoomButton.enabled = YES;
            self.viewInRoomButton.alpha = 1;
        }];
    }

    if (fair) {
        self.mapButtonConstraint.constant = artwork.canViewInRoom ? -8 : 48;

        void(^revealMapButton)(NSArray *) = ^(NSArray *maps) {
            if (maps.count > 0) {
                [UIView animateWithDuration:ARAnimationQuickDuration animations:^{
                    self.viewInMapButton.enabled = YES;
                    self.viewInMapButton.alpha = 1;
                }];
            }
        };

        if (fair.maps.count > 0) {
            revealMapButton(fair.maps);
        } else {
            [fair getFairMaps:revealMapButton];
        }
    }
}

- (CGSize)intrinsicContentSize
{
    return (CGSize) { UIViewNoIntrinsicMetric, 48 };
}

@end
