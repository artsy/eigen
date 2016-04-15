#import "ARArtworkMetadataView.h"
#import "ARSplitStackView.h"
#import "ARWhitespaceGobbler.h"
#import "ARAppConstants.h"

#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@interface ARArtworkMetadataView ()
@property (nonatomic, strong) ARArtworkPreviewActionsView *artworkPreviewActions;
@property (nonatomic, strong) ARArtworkPreviewImageView *artworkPreview;
@property (nonatomic, strong) ARArtworkActionsView *actionsView;
@property (nonatomic, strong) ARArtworkDetailView *artworkDetailView;
@property (nonatomic, strong, readonly) NSArray *verticalConstraints;
@property (nonatomic, strong, readonly) NSArray *horizontalConstraints;

@end


@implementation ARArtworkMetadataView

- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair
{
    CGFloat margin = [UIDevice isPad] ? 50 : 20;
    CGFloat imageMargin = [UIDevice isPad] ? margin : 0;

    self = [super init];
    if (!self) {
        return nil;
    }
    [self setTranslatesAutoresizingMaskIntoConstraints:NO];
    _fair = fair;

    ARArtworkPreviewImageView *artworkPreview = [[ARArtworkPreviewImageView alloc] init];
    ARArtworkPreviewActionsView *previewActionsView = [[ARArtworkPreviewActionsView alloc] initWithArtwork:artwork andFair:fair];
    ARArtworkDetailView *artworkDetailView = [[ARArtworkDetailView alloc] initWithArtwork:artwork andFair:fair];
    ARArtworkActionsView *artworkActionsView = [[ARArtworkActionsView alloc] initWithArtwork:artwork];
    self.artworkPreview = artworkPreview;
    self.actionsView = artworkActionsView;
    self.artworkPreviewActions = previewActionsView;
    self.artworkDetailView = artworkDetailView;

    UIView *left = [[UIView alloc] init];
    UIView *right = [[UIView alloc] init];

    [self addSubview:left];
    [self addSubview:right];

    [left addSubview:artworkPreview];
    [artworkPreview alignTopEdgeWithView:left predicate:@"0"];
    [artworkPreview alignCenterXWithView:left predicate:@"0"];
    [artworkPreview constrainWidthToView:left predicate:@"0"];

    ARWhitespaceGobbler *whitespaceGobbler = [[ARWhitespaceGobbler alloc] init];
    [left addSubview:whitespaceGobbler];
    [whitespaceGobbler constrainTopSpaceToView:artworkPreview predicate:@"0"];
    [left alignBottomEdgeWithView:whitespaceGobbler predicate:@"0"];

    [right addSubview:previewActionsView];
    [right addSubview:artworkDetailView];
    [right addSubview:artworkActionsView];
    whitespaceGobbler = [[ARWhitespaceGobbler alloc] init];
    [right addSubview:whitespaceGobbler];

    [artworkDetailView alignLeadingEdgeWithView:right predicate:@"0"];
    [artworkActionsView alignLeading:@"0" trailing:@"0" toView:right];
    [whitespaceGobbler constrainTopSpaceToView:artworkActionsView predicate:@"0"];
    [whitespaceGobbler alignLeading:@"0" trailing:@"0" toView:right];
    [whitespaceGobbler alignBottomEdgeWithView:right predicate:@"0"];

    [left alignTopEdgeWithView:self predicate:@(imageMargin).stringValue];
    [left alignLeadingEdgeWithView:self predicate:@(imageMargin).stringValue];
    [right alignTrailingEdgeWithView:self predicate:@(-margin).stringValue];

    [self alignBottomEdgeWithView:right predicate:@"0"];

    // These constraints are for portrait and landscape orientations.
    //
    // The iPhone *only* supports portrait orientation, for which the verticalConstraints are used, whereas the iPad
    // uses the horizontalConstraints in landscape mode.

    // Constraints for both iPad orientations
    if ([UIDevice isPad]) {
        [artworkDetailView alignTopEdgeWithView:right predicate:@"0"];
    }

    // Constraints that apply to iPhone and vertical iPad
    NSMutableArray *verticalConstraints = [NSMutableArray array];

    [verticalConstraints addObject:[right constrainTopSpaceToView:left predicate:@"28"]];
    [verticalConstraints addObject:[left alignTrailingEdgeWithView:self predicate:@(-imageMargin).stringValue]];
    [verticalConstraints addObject:[right alignLeadingEdgeWithView:self predicate:@(margin).stringValue]];

    [verticalConstraints addObject:[previewActionsView alignTopEdgeWithView:right predicate:@"0"]];
    [verticalConstraints addObject:[previewActionsView alignTrailingEdgeWithView:right predicate:@"0"]];
    [verticalConstraints addObject:[artworkActionsView constrainTopSpaceToView:artworkDetailView predicate:@"8"]];

    if ([UIDevice isPad]) {
        [verticalConstraints addObject:[previewActionsView constrainLeadingSpaceToView:artworkDetailView predicate:@">=0"]];
        [verticalConstraints addObject:[artworkDetailView alignBottomEdgeWithView:previewActionsView predicate:@">=0"]];
    } else {
        [verticalConstraints addObject:[artworkDetailView constrainTopSpaceToView:previewActionsView predicate:@"0"]];
        [verticalConstraints addObject:[artworkDetailView alignTrailingEdgeWithView:right predicate:@"0"]];
    }

    _verticalConstraints = [verticalConstraints copy];

    if ([UIDevice isPad]) {
        // iPhone only supports portrait, so no need to disable these on iPhone.
        [NSLayoutConstraint deactivateConstraints:self.verticalConstraints];

        // Constraints for horizontal iPad layout
        NSMutableArray *horizontalConstraints = [NSMutableArray array];

        [horizontalConstraints addObject:[right alignTopEdgeWithView:self predicate:@(margin).stringValue]];
        [horizontalConstraints addObject:[right constrainLeadingSpaceToView:left predicate:@"40"]];
        [horizontalConstraints addObject:[right constrainWidthToView:self predicate:@"*.26"]];
        [horizontalConstraints addObject:[self alignBottomEdgeWithView:left predicate:@"0"]];
        [horizontalConstraints addObject:[self alignBottomEdgeWithView:left predicate:@">=0"]];
        [horizontalConstraints addObject:[self alignBottomEdgeWithView:right predicate:@">=0"]];

        [horizontalConstraints addObject:[artworkDetailView alignTrailingEdgeWithView:right predicate:@"0"]];
        [horizontalConstraints addObject:[previewActionsView constrainTopSpaceToView:artworkDetailView predicate:@"12"]];
        [horizontalConstraints addObject:[previewActionsView alignLeadingEdgeWithView:right predicate:@">=0"]];
        [horizontalConstraints addObject:[previewActionsView alignTrailingEdgeWithView:right predicate:@"<=0"]];
        [horizontalConstraints addObject:[previewActionsView alignCenterXWithView:right predicate:@"0"]];
        [horizontalConstraints addObject:[artworkActionsView constrainTopSpaceToView:previewActionsView predicate:@"22"]];

        _horizontalConstraints = [horizontalConstraints copy];
        [NSLayoutConstraint deactivateConstraints:self.horizontalConstraints];
    }

    [self registerForNetworkNotifications];

    artworkPreview.artwork = artwork;
    _left = left;
    _right = right;
    return self;
}

- (void)updateConstraintsIsLandscape:(BOOL)isLandscape
{
    if ([UIDevice isPad]) {
        if (isLandscape) {
            [NSLayoutConstraint deactivateConstraints:self.verticalConstraints];
            [NSLayoutConstraint activateConstraints:self.horizontalConstraints];
        } else {
            [NSLayoutConstraint deactivateConstraints:self.horizontalConstraints];
            [NSLayoutConstraint activateConstraints:self.verticalConstraints];
        }
    }
}

- (void)setDelegate:(id<ARArtworkDetailViewDelegate, ARArtworkDetailViewButtonDelegate, ARArtworkActionsViewDelegate, ARArtworkActionsViewButtonDelegate, ARArtworkPreviewImageViewDelegate, ARArtworkPreviewActionsViewDelegate>)delegate
{
    self.artworkPreview.delegate = delegate;
    self.artworkPreviewActions.delegate = delegate;
    self.artworkDetailView.delegate = delegate;
    self.actionsView.delegate = delegate;
}

- (void)registerForNetworkNotifications
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(networkAvailable) name:ARNetworkAvailableNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(networkUnavailable) name:ARNetworkUnavailableNotification object:nil];
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:ARNetworkAvailableNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:ARNetworkUnavailableNotification object:nil];
}

- (void)updateWithFair:(Fair *)fair
{
    [self.artworkDetailView updateWithFair:fair];
}

- (void)networkAvailable
{
    self.actionsView.enabled = YES;
}

- (void)networkUnavailable
{
    self.actionsView.enabled = NO;
}

- (UIImageView *)imageView
{
    return self.artworkPreview;
}

- (void)setUserInteractionEnabled:(BOOL)userInteractionEnabled
{
    [super setUserInteractionEnabled:userInteractionEnabled];
    [self.artworkPreview setUserInteractionEnabled:userInteractionEnabled];
}

@end
