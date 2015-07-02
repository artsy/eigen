#import "ARArtistBiographyViewController.h"
#import "ARTextView.h"
#import "ORStackView+ArtsyViews.h"


@interface ARArtistBiographyViewController () <ARTextViewDelegate>
@property (nonatomic, strong, readwrite) Artist *artist;
@property (nonatomic, strong) ORStackScrollView *view;
@end


@implementation ARArtistBiographyViewController

@dynamic view;

- (instancetype)initWithArtist:(Artist *)artist
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _artist = artist;

    return self;
}

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] init];
    self.view.stackView.bottomMarginHeight = 20;
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
    [self.view.stackView addPageTitleWithString:self.artist.name];

    ARTextView *textView = [[ARTextView alloc] init];
    textView.viewControllerDelegate = self;
    [textView setMarkdownString:self.artist.blurb];
    [self.view.stackView addSubview:textView withTopMargin:@"20" sideMargin:@"40"];

    [super viewDidLoad];
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.artist) {
        return @{ @"artist" : self.artist.artistID };
    }

    return nil;
}

- (BOOL)shouldAutorotate
{
    return NO;
}

#pragma mark - ARTextViewDelegate

- (void)textView:(ARTextView *)textView shouldOpenViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

@end
