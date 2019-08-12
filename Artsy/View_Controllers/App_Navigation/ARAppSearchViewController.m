#import "ARAppSearchViewController.h"

#import "Artist.h"
#import "Artwork.h"
#import "ArtsyAPI+Search.h"
#import "ARParallaxEffect.h"
#import "ARSearchViewController+Private.h"
#import "Fair.h"
#import "Gene.h"
#import "Profile.h"
#import "SiteFeature.h"
#import "UIView+HitTestExpansion.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARMenuAwareViewController.h"
#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"
#import "AROptions.h"
#import "ARFonts.h"
#import "SearchResult.h"

#import <Emission/ARArtistComponentViewController.h>
#import <FXBlurView/FXBlurView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

static const NSInteger ARAppSearchParallaxDistance = 20;


@interface ARAppSearchViewController () <ARMenuAwareViewController>
@property (readonly, nonatomic, strong) UIButton *clearButton;
@property (readonly, nonatomic) UIView *bottomBorder;
@property (readwrite, nonatomic, strong) UIView *backgroundView;
@end


@implementation ARAppSearchViewController

+ (instancetype)sharedSearchViewController;
{
    static ARAppSearchViewController *sharedInstance = nil;
    static dispatch_once_t onceToken = 0;
    dispatch_once(&onceToken, ^{
        sharedInstance = [self new];
    });
    return sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }
    self.defaultInfoLabelText = @"Search Artists, Artworks, Movements, or Medium.";
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    UIButton *clearButton = [[UIButton alloc] init];
    clearButton.imageView.contentMode = UIViewContentModeScaleAspectFit;
    [self.view addSubview:clearButton];
    self.textField.clipsToBounds = NO;
    [clearButton ar_extendHitTestSizeByWidth:6 andHeight:16];
    [clearButton alignTrailingEdgeWithView:self.textField predicate:@"0"];
    [clearButton constrainHeightToView:self.textField predicate:@"-2"];
    [clearButton alignCenterYWithView:self.textField predicate:@"0"];
    [clearButton alignAttribute:NSLayoutAttributeWidth toAttribute:NSLayoutAttributeHeight ofView:clearButton predicate:@"0"];
    [clearButton addTarget:self action:@selector(clearTapped:) forControlEvents:UIControlEventTouchUpInside];
    clearButton.hidden = YES;

    [clearButton setImage:[UIImage imageNamed:@"TextfieldClearButton"] forState:UIControlStateNormal];
    [clearButton setImage:[UIImage imageNamed:@"TextfieldClearButton"] forState:UIControlStateHighlighted];
    _clearButton = clearButton;

    // a bottom border
    UIView *bottomBorder = [[UIView alloc] init];
    bottomBorder.backgroundColor = [UIColor whiteColor];
    bottomBorder.opaque = NO;
    bottomBorder.layer.opacity = 0.2f;
    [self.view addSubview:bottomBorder];
    _bottomBorder = bottomBorder;
    [bottomBorder constrainHeight:@"1"];
    [bottomBorder alignLeadingEdgeWithView:self.searchIcon predicate:@"-2"];
    [bottomBorder alignTrailingEdgeWithView:self.textField predicate:@"2"];
    [bottomBorder constrainTopSpaceToView:self.searchBoxView predicate:@"16"];
}

- (void)clearTapped:(id)sender
{
    [self clearSearchAnimated:YES];
}

- (void)setSearchQuery:(NSString *)text animated:(BOOL)animated;
{
    [super setSearchQuery:text animated:animated];
    self.clearButton.hidden = self.textField.text.length == 0;
}

- (AFHTTPRequestOperation *)searchWithQuery:(NSString *)query success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    return [ArtsyAPI searchWithQuery:query success:success failure:failure];
}

- (void)selectedResult:(NSObject <SearchResultable> *)result ofType:(NSString *)type fromQuery:(NSString *)query
{
    UIViewController *controller = [ARSwitchBoard.sharedInstance loadPath:result.href];
    if (controller) {
        [self.ar_TopMenuViewController pushViewController:controller animated:YES];
    }
}

- (void)closeSearch:(id)sender
{
    [super closeSearch:sender];
    [self.navigationController popViewControllerAnimated:YES];
}

#pragma mark - ARMenuAwareViewController

- (BOOL)hidesNavigationButtons
{
    return YES;
}

- (BOOL)prefersStatusBarHidden
{
    return YES;
}

#pragma mark - ARAppSearchTransition

- (void)setBackgroundImage:(UIImage *)backgroundImage;
{
    [self.backgroundView removeFromSuperview];
    self.backgroundView = nil;

    if (backgroundImage) {
        // [self.backgroundView removeFromSuperview];
        UIImage *blurImage = [backgroundImage blurredImageWithRadius:12 iterations:2 tintColor:nil];
        CGRect outset = CGRectInset(self.view.bounds, -ARAppSearchParallaxDistance, -ARAppSearchParallaxDistance);

        UIImageView *backgroundView = [[UIImageView alloc] initWithFrame:outset];

        ARParallaxEffect *parallax = [[ARParallaxEffect alloc] initWithOffset:ARAppSearchParallaxDistance];
        [backgroundView addMotionEffect:parallax];

        backgroundView.image = blurImage;
        [self.view insertSubview:backgroundView atIndex:0];

        backgroundView.alpha = 0.2;
        self.backgroundView = backgroundView;
    }
}

@end
