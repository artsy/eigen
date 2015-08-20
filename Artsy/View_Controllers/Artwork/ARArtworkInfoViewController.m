#import "ARArtworkInfoViewController.h"
#import "ORStackView+ArtsyViews.h"
#import "ARTextView.h"


@interface ARArtworkInfoViewController () <ARTextViewDelegate>
@property (nonatomic, strong) Artwork *artwork;
@property (nonatomic, strong) ORStackScrollView *view;
@end


@implementation ARArtworkInfoViewController

@dynamic view;

- (instancetype)initWithArtwork:(Artwork *)artwork
{
    self = [super init];
    if (!self) {
        return nil;
    }
    _artwork = artwork;
    return self;
}

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] init];
    self.view.stackView.bottomMarginHeight = 0;
    self.view.backgroundColor = [UIColor whiteColor];
}

- (void)viewWillAppear:(BOOL)animated
{
    self.view.delegate = [ARScrollNavigationChief chief];
    [super viewWillAppear:animated];
}

- (void)viewWillDisappear:(BOOL)animated
{
    self.view.delegate = nil;

    [super viewWillDisappear:animated];
}

- (void)dealloc
{
    self.view.delegate = nil;
}

- (void)viewDidLoad
{
    [self.view.stackView addPageTitleWithString:@"More Info"];
    [self.view.stackView addWhiteSpaceWithHeight:@"20"];
    [self addSectionWithTitle:@"Provenance" andText:self.artwork.provenance];
    [self addSectionWithTitle:@"Signature" andText:self.artwork.signature];
    [self addSectionWithTitle:@"Additional Information" andText:self.artwork.additionalInfo];
    [self addSectionWithTitle:@"Literature" andText:self.artwork.literature];
    [self addSectionWithTitle:@"Exhibition History" andText:self.artwork.exhibitionHistory];

    [super viewDidLoad];
}

- (void)addSectionWithTitle:(NSString *)title andText:(NSString *)text
{
    if (![text length]) {
        return;
    }
    ARLabel *label = [[ARSansSerifLabel alloc] init];
    label.font = [label.font fontWithSize:14];
    label.text = title;
    [self.view.stackView addSubview:label withTopMargin:@"0" sideMargin:@"40"];

    ARTextView *textView = [[ARTextView alloc] init];
    textView.viewControllerDelegate = self;
    [textView setMarkdownString:text];
    [self.view.stackView addSubview:textView withTopMargin:@"0" sideMargin:@"30"];
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.artwork) {
        return @{ @"artwork" : self.artwork.artworkID };
    }
    return nil;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

#pragma mark - ARTextViewDelegate

- (void)textView:(ARTextView *)textView shouldOpenViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

@end
