#import "ARArtworkMetadataView.h"
#import "ARArtworkPreviewImageView.h"
#import "ARArtworkPreviewActionsView.h"
#import "ARSplitStackView.h"
#import "ARWhitespaceGobbler.h"

static const CGFloat ARPadRightColumnWidth = 280;

@interface ARArtworkMetadataView() <ARArtworkDetailViewDelegate, ARArtworkActionsViewDelegate>
@property (nonatomic, strong) ARArtworkPreviewActionsView *artworkPreviewActions;
@property (nonatomic, strong) ARArtworkPreviewImageView *artworkPreview;
@property (nonatomic, strong) ARArtworkActionsView *actionsView;
@property (nonatomic, strong) ARArtworkDetailView *artworkDetailView;
@end

@implementation ARArtworkMetadataView

- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair
{
    self = [super init];
    if (!self) { return nil; }
    [self setTranslatesAutoresizingMaskIntoConstraints:NO];
    _fair = fair;

    ARArtworkPreviewImageView *artworkPreview = [[ARArtworkPreviewImageView alloc] init];
    ARArtworkPreviewActionsView *previewActionsView = [[ARArtworkPreviewActionsView alloc] initWithArtwork:artwork andFair:fair];
    ARArtworkDetailView *artworkDetailView = [[ARArtworkDetailView alloc] initWithArtwork:artwork andFair:fair];
    ARArtworkActionsView *artworkActionsView = [[ARArtworkActionsView alloc] initWithArtwork:artwork];
    artworkActionsView.alpha = 0;
    self.artworkPreview = artworkPreview;
    self.actionsView = artworkActionsView;
    self.artworkPreviewActions = previewActionsView;
    self.artworkDetailView = artworkDetailView;

    if ([UIDevice isPad]) {
        NSString *rightWidthString = [NSString stringWithFormat:@"%.0f", ARPadRightColumnWidth];
        ARSplitStackView *splitView = [[ARSplitStackView alloc] initWithLeftPredicate:nil rightPredicate:rightWidthString];
        [self addSubview:splitView withTopMargin:nil sideMargin:@"100"];
        [splitView.rightStack constrainLeadingSpaceToView:splitView.leftStack predicate:@"40"];
        [splitView.leftStack addSubview:artworkPreview withTopMargin:@"40" sideMargin:@"0@750"];
        [artworkPreview constrainWidthToView:splitView.leftStack predicate:@"0@1000"];
        [splitView.leftStack addSubview:previewActionsView withTopMargin:@"28" sideMargin:@"0"];
        [splitView.rightStack addSubview:artworkDetailView withTopMargin:@"30" sideMargin:@"0"];
        [splitView.rightStack addSubview:artworkActionsView withTopMargin:@"8" sideMargin:@"0"];
        ARWhitespaceGobbler *whitespaceGobbler = [[ARWhitespaceGobbler alloc] init];
        [splitView.leftStack addSubview:whitespaceGobbler withTopMargin:@"0" sideMargin:nil];

        whitespaceGobbler = [[ARWhitespaceGobbler alloc] init];
        [splitView.rightStack addSubview:whitespaceGobbler withTopMargin:@"0" sideMargin:nil];
    } else {
        [self constrainWidth:@"320"];
        [self addSubview:artworkPreview withTopMargin:@"0" sideMargin:@"0"];
        [self addSubview:previewActionsView withTopMargin:@"28" sideMargin:@"40"];
        [self addSubview:artworkDetailView withTopMargin:@"0" sideMargin:@"40"];
        [self addSubview:artworkActionsView withTopMargin:@"8" sideMargin:@"40"];
    }
    self.bottomMarginHeight = 0;
    [self registerForNetworkNotifications];
    // Create and add the artworkPreview as a subview before setting its artwork
    // so that the necessary constraints already exist when setting its image.
    artworkPreview.artwork = artwork;
    return self;
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
