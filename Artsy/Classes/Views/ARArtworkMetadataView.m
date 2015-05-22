#import "ARArtworkMetadataView.h"
#import "ARArtworkPreviewImageView.h"
#import "ARArtworkPreviewActionsView.h"
#import "ARSplitStackView.h"
#import "ARWhitespaceGobbler.h"

@interface ARArtworkMetadataView() <ARArtworkDetailViewDelegate, ARArtworkActionsViewDelegate>

@property (nonatomic, strong, readonly) UIView *left;
@property (nonatomic, strong, readonly) ORStackView *right;
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

    UIView *imageContainer = [[UIView alloc] init];
    UIView *textContainer = [[UIView alloc] init];

    [self addSubview:imageContainer];
    [self addSubview:textContainer];
    
    [imageContainer addSubview:artworkPreview];
    [artworkPreview alignTopEdgeWithView:imageContainer predicate:@"0"];
    [artworkPreview alignCenterXWithView:imageContainer predicate:@"0"];
    [artworkPreview constrainWidthToView:imageContainer predicate:@"0"];
    
    ARWhitespaceGobbler *whitespaceGobbler = [[ARWhitespaceGobbler alloc] init];
    [imageContainer addSubview:whitespaceGobbler];
    [whitespaceGobbler constrainTopSpaceToView:artworkPreview predicate:@"0"];
    [imageContainer alignBottomEdgeWithView:whitespaceGobbler predicate:@"0"];
    
    [textContainer addSubview:previewActionsView];
    [textContainer addSubview:artworkDetailView];
    [textContainer addSubview:artworkActionsView];
    whitespaceGobbler = [[ARWhitespaceGobbler alloc] init];
    [textContainer addSubview:whitespaceGobbler];
    
    [artworkDetailView alignLeadingEdgeWithView:textContainer predicate:@"0"];
    [artworkActionsView alignLeading:@"0" trailing:@"0" toView:textContainer];
    [whitespaceGobbler constrainTopSpaceToView:artworkActionsView predicate:@"0"];
    [whitespaceGobbler alignTop:nil leading:@"0" bottom:@"0" trailing:@"0" toView:textContainer];
    
    
    [imageContainer alignTopEdgeWithView:self predicate:@(imageMargin).stringValue];
    [imageContainer alignLeadingEdgeWithView:self predicate:@(imageMargin).stringValue];
    [textContainer alignTrailingEdgeWithView:self predicate:@(-margin).stringValue];
    
    [self alignBottomEdgeWithView:textContainer predicate:@"0"];
    
    // Constraints for both iPad orientations but not iPhone
    if ([UIDevice isPad]) {
        [artworkDetailView alignTopEdgeWithView:textContainer predicate:@"0"];
    
    // iPhone layout only
    } else {
        [artworkDetailView constrainTopSpaceToView:previewActionsView predicate:@"0"];
        [artworkDetailView alignTrailingEdgeWithView:textContainer predicate:@"0"];
    }
    
    // Constraints that apply to iPhone and vertical iPad
    NSMutableArray *verticalConstriants =[NSMutableArray array];
    [verticalConstriants addObject:[[textContainer constrainTopSpaceToView:imageContainer predicate:@"28"] lastObject]];
    [verticalConstriants addObject:[[imageContainer alignTrailingEdgeWithView:self predicate:@(-imageMargin).stringValue] lastObject]];
    [verticalConstriants addObject:[[textContainer alignLeadingEdgeWithView:self predicate:@(margin).stringValue] lastObject]];

    [verticalConstriants addObject:[[previewActionsView alignTopEdgeWithView:textContainer predicate:@"0"] lastObject]];
    [verticalConstriants addObject:[[previewActionsView alignTrailingEdgeWithView:textContainer predicate:@"0"] lastObject]];
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

    [horizontalConstriants addObject:[[textContainer alignTopEdgeWithView:self predicate:@(margin).stringValue] lastObject]];
    [horizontalConstriants addObject:[[textContainer constrainLeadingSpaceToView:imageContainer predicate:@"40"] lastObject]];
    [horizontalConstriants addObject:[[textContainer constrainWidthToView:self predicate:@"*.26"] lastObject]];
    [horizontalConstriants addObject:[[self alignBottomEdgeWithView:imageContainer predicate:@"0"] lastObject]];
    [horizontalConstriants addObject:[[self alignBottomEdgeWithView:imageContainer predicate:@">=0"] lastObject]];
    [horizontalConstriants addObject:[[self alignBottomEdgeWithView:textContainer predicate:@">=0"] lastObject]];
    
    [horizontalConstriants addObject:[[artworkDetailView alignTrailingEdgeWithView:textContainer predicate:@"0"] lastObject]];
    [horizontalConstriants addObject:[[previewActionsView constrainTopSpaceToView:artworkDetailView predicate:@"12"] lastObject]];
    [horizontalConstriants addObject:[[previewActionsView alignLeadingEdgeWithView:textContainer predicate:@">=0"] lastObject]];
    [horizontalConstriants addObject:[[previewActionsView alignTrailingEdgeWithView:textContainer predicate:@"<=0"] lastObject]];
    [horizontalConstriants addObject:[[previewActionsView alignCenterXWithView:textContainer predicate:@"0"] lastObject]];
    [horizontalConstriants addObject:[[artworkActionsView constrainTopSpaceToView:previewActionsView predicate:@"22"] lastObject]];

    _horizontalConstraints = [horizontalConstriants copy];
    
    [NSLayoutConstraint deactivateConstraints:self.verticalConstraints];
    [NSLayoutConstraint deactivateConstraints:self.horizontalConstraints];

    
    [self registerForNetworkNotifications];
    
    artworkPreview.artwork = artwork;
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

- (void)setDelegate:(id<ARArtworkMetadataViewDelegate>)delegate
{
    _delegate = delegate;
    self.artworkDetailView.delegate = self;
    self.actionsView.delegate = self;
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

#pragma mark - ARArtworkActionsViewDelegate

-(void)didUpdateArtworkActionsView:(ARArtworkActionsView *)actionsView
{
    [self.delegate artworkMetadataView:self didUpdateArtworkActionsView:actionsView];
    [self layoutIfNeeded];
}

#pragma mark - ARArtworkDetailViewDelegate

-(void)artworkDetailView:(ARArtworkDetailView *)detailView shouldPresentViewController:(UIViewController *)viewController
{
    [self.delegate artworkMetadataView:self shouldPresentViewController:viewController];
}

-(void)didUpdateArtworkDetailView:(ARArtworkDetailView *)detailView
{
    [self.delegate artworkMetadataView:self didUpdateArtworkDetailView:detailView];
}

@end
