#import "ARArtworkMetadataView.h"
#import "ARArtworkPreviewImageView.h"
#import "ARArtworkPreviewActionsView.h"
#import "ARSplitStackView.h"
#import "ARWhitespaceGobbler.h"

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
    if (!self) { return nil; }
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
    [whitespaceGobbler alignTop:nil leading:@"0" bottom:@"0" trailing:@"0" toView:right];
    
    
    [left alignTopEdgeWithView:self predicate:@(imageMargin).stringValue];
    [left alignLeadingEdgeWithView:self predicate:@(imageMargin).stringValue];
    [right alignTrailingEdgeWithView:self predicate:@(-margin).stringValue];
    
    [self alignBottomEdgeWithView:right predicate:@"0"];
    
    // Constraints for both iPad orientations but not iPhone
    if ([UIDevice isPad]) {
        [artworkDetailView alignTopEdgeWithView:right predicate:@"0"];
    
    // iPhone layout only
    } else {
        [artworkDetailView constrainTopSpaceToView:previewActionsView predicate:@"0"];
        [artworkDetailView alignTrailingEdgeWithView:right predicate:@"0"];
    }
    
    // Constraints that apply to iPhone and vertical iPad
    NSMutableArray *verticalConstriants =[NSMutableArray array];
    [verticalConstriants addObject:[[right constrainTopSpaceToView:left predicate:@"28"] lastObject]];
    [verticalConstriants addObject:[[left alignTrailingEdgeWithView:self predicate:@(-imageMargin).stringValue] lastObject]];
    [verticalConstriants addObject:[[right alignLeadingEdgeWithView:self predicate:@(margin).stringValue] lastObject]];

    [verticalConstriants addObject:[[previewActionsView alignTopEdgeWithView:right predicate:@"0"] lastObject]];
    [verticalConstriants addObject:[[previewActionsView alignTrailingEdgeWithView:right predicate:@"0"] lastObject]];
    [verticalConstriants addObject:[[artworkActionsView constrainTopSpaceToView:artworkDetailView predicate:@"8"] lastObject]];

    // Vertical iPad only
    if ([UIDevice isPad]) {
        [verticalConstriants addObject:[[previewActionsView constrainLeadingSpaceToView:artworkDetailView predicate:@">=0"] lastObject]];
        [verticalConstriants addObject:[[artworkDetailView alignBottomEdgeWithView:previewActionsView predicate:@">=0"] lastObject]];
    } else {
    }
    
    _verticalConstraints = [verticalConstriants copy];
    
    // Constraints for horizontal iPad layout
    NSMutableArray *horizontalConstriants =[NSMutableArray array];

    [horizontalConstriants addObject:[[right alignTopEdgeWithView:self predicate:@(margin).stringValue] lastObject]];
    [horizontalConstriants addObject:[[right constrainLeadingSpaceToView:left predicate:@"40"] lastObject]];
    [horizontalConstriants addObject:[[right constrainWidthToView:self predicate:@"*.26"] lastObject]];
    [horizontalConstriants addObject:[[self alignBottomEdgeWithView:left predicate:@"0"] lastObject]];
    [horizontalConstriants addObject:[[self alignBottomEdgeWithView:left predicate:@">=0"] lastObject]];
    [horizontalConstriants addObject:[[self alignBottomEdgeWithView:right predicate:@">=0"] lastObject]];
    
    [horizontalConstriants addObject:[[artworkDetailView alignTrailingEdgeWithView:right predicate:@"0"] lastObject]];
    [horizontalConstriants addObject:[[previewActionsView constrainTopSpaceToView:artworkDetailView predicate:@"12"] lastObject]];
    [horizontalConstriants addObject:[[previewActionsView alignLeadingEdgeWithView:right predicate:@">=0"] lastObject]];
    [horizontalConstriants addObject:[[previewActionsView alignTrailingEdgeWithView:right predicate:@"<=0"] lastObject]];
    [horizontalConstriants addObject:[[previewActionsView alignCenterXWithView:right predicate:@"0"] lastObject]];
    [horizontalConstriants addObject:[[artworkActionsView constrainTopSpaceToView:previewActionsView predicate:@"22"] lastObject]];

    _horizontalConstraints = [horizontalConstriants copy];
    
    [NSLayoutConstraint deactivateConstraints:self.verticalConstraints];
    [NSLayoutConstraint deactivateConstraints:self.horizontalConstraints];

    
    [self registerForNetworkNotifications];
    
    artworkPreview.artwork = artwork;
    _left = left;
    _right = right;
    return self;
}

- (void)updateConstraintsIsLandscape:(BOOL)isLandscape
{
    if (isLandscape) {
        [NSLayoutConstraint deactivateConstraints:self.verticalConstraints];
        [NSLayoutConstraint activateConstraints:self.horizontalConstraints];
    } else {
        [NSLayoutConstraint deactivateConstraints:self.horizontalConstraints];
        [NSLayoutConstraint activateConstraints:self.verticalConstraints];
    }
}

- (void)setDelegate:(id<ARArtworkDetailViewDelegate, ARArtworkActionsViewDelegate, ARArtworkPreviewImageDelegate>)delegate
{
    self.artworkPreview.delegate = delegate;
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
