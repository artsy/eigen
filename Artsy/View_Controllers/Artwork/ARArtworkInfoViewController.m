#import "ARArtworkInfoViewController.h"

#import "Artwork.h"
#import "ORStackView+ArtsyViews.h"
#import "ARTextView.h"
#import "ARScrollNavigationChief.h"

#import "UIDevice-Hardware.h"
@import Artsy_UILabels;
#import <ORStackView/ORStackScrollView.h>


@interface ARArtworkInfoViewController () <ARTextViewDelegate>
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
    [self.view.stackView addWhiteSpaceWithHeight:@"40"];
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

    // This is a tad un-intuitive, effectively, in adding paragraph spacing
    // in the markdown, we get an extra ~20 px padding at the bottom that looks
    // like too much in this view, but looks pretty normal everywhere else in the app
    // so this title has a negative top margin in order to make it feel tighter.
    [self.view.stackView addSubview:label withTopMargin:@"-20" sideMargin:@"40"];

    ARTextView *textView = [[ARTextView alloc] init];
    textView.viewControllerDelegate = self;
    [textView setMarkdownString:text];
    [self.view.stackView addSubview:textView withTopMargin:@"10" sideMargin:@"40"];
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
    [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

@end
