#import "ARFairMapViewController.h"

#import "Artist.h"
#import "Artwork.h"
#import "Fair.h"
#import "Gene.h"
#import "Image.h"
#import "PartnerShow.h"
#import "Profile.h"
#import "ArtsyAPI+Artists.h"
#import "ArtsyAPI+Shows.h"
#import "ARTiledImageDataSourceWithImage.h"
#import "ARFairMapView.h"
#import "ARFairMapZoomManager.h"
#import "ARFairShowMapper.h"
#import "ARFairSearchViewController.h"
#import "UIViewController+SimpleChildren.h"
#import "ARFairMapAnnotationCallOutView.h"
#import "ARArtworkSetViewController.h"
#import "ARSearchFieldButton.h"
#import "SiteFeature.h"
#import "ARCustomEigenLabels.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"
#import "ARMacros.h"

#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <EDColor/EDColor.h>
#import <ReactiveObjC/ReactiveObjC.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARFairMapViewController () <NAMapViewDelegate, ARFairSearchViewControllerDelegate, ARSearchFieldButtonDelegate>
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong, readwrite) ARFairMapView *mapView;
@property (nonatomic, strong) ARSearchFieldButton *searchButton;
@property (nonatomic, strong, readwrite) ARTiledImageDataSourceWithImage *mapDataSource;
@property (nonatomic, strong, readwrite) ARFairSearchViewController *searchVC;
@property (nonatomic, assign, readwrite) BOOL calloutAnnotationHighlighted;
@property (nonatomic, readonly, strong) ARFairMapAnnotationCallOutView *calloutView;
@property (nonatomic, readonly, strong) NSArray *selectedPartnerShows;
@property (nonatomic, readonly, strong) NSString *selectedTitle;
@end


@implementation ARFairMapViewController

- (id)initWithFair:(Fair *)fair
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _fair = fair;

    Map *map = _fair.maps.firstObject;
    _mapDataSource = [[ARTiledImageDataSourceWithImage alloc] initWithImage:map.image];
    _expandAnnotations = YES;

    return self;
}

- (id)initWithFair:(Fair *)fair title:(NSString *)title selectedPartnerShows:(NSArray *)selectedPartnerShows
{
    self = [self initWithFair:fair];
    if (!self) {
        return nil;
    }

    _selectedTitle = title;
    _selectedPartnerShows = selectedPartnerShows;

    return self;
}

- (void)dealloc
{
    if (_mapShowMapper) {
        [_fair removeObserver:_mapShowMapper forKeyPath:ar_keypath(Fair.new, shows)];
        [_fair removeObserver:self forKeyPath:ar_keypath(Fair.new, shows)];
    }
}

- (void)viewDidLoad
{
    ARFairMapView *mapView = [[ARFairMapView alloc] initWithFrame:self.view.frame tiledImageDataSource:self.mapDataSource];
    mapView.mapViewDelegate = self;
    mapView.zoomStep = 2.5;
    mapView.showsVerticalScrollIndicator = NO;
    mapView.showsHorizontalScrollIndicator = NO;
    mapView.backgroundImageURL = [self.mapDataSource.image urlForThumbnailImage];
    mapView.backgroundColor = [UIColor colorWithHex:0xf6f6f6];
    [self.view addSubview:mapView];
    _mapView = mapView;

    _calloutView = [[ARFairMapAnnotationCallOutView alloc] initOnMapView:self.mapView fair:self.fair];
    self.calloutView.hidden = YES;
    [self.mapView addSubview:self.calloutView];

    UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tappedOnMap:)];
    [self.mapView addGestureRecognizer:tapGesture];

    // Prioritise the double tap gesture over the single tap for buttons
    self.mapView.doubleTapGesture.delaysTouchesBegan = YES;

    // We don't want to trigger the load view early so these get set up after
    _mapZoomManager = [[ARFairMapZoomManager alloc] initWithMap:self.mapView dataSource:self.mapDataSource];

    _mapShowMapper = [[ARFairShowMapper alloc] initWithMapView:mapView map:self.fair.maps.firstObject imageSize:[self.mapDataSource imageSizeForImageView:nil]];
    [self.fair addObserver:self.mapShowMapper forKeyPath:ar_keypath(Fair.new, shows) options:NSKeyValueObservingOptionNew context:nil];
    [self.fair addObserver:self forKeyPath:ar_keypath(Fair.new, shows) options:NSKeyValueObservingOptionNew context:nil];

    [self.mapZoomManager setMaxMinZoomScalesForCurrentBounds];
    [self.mapZoomManager zoomToFitAnimated:NO];
    [self.mapShowMapper setupMapFeatures];

    if (!self.selectedTitle) {
        self.searchButton = [[ARSearchFieldButton alloc] init];
        self.searchButton.delegate = self;
        [self.view addSubview:self.searchButton];
        [self.searchButton constrainTopSpaceToView:self.flk_topLayoutGuide predicate:@"17"];
        [self.searchButton alignTrailingEdgeWithView:self.view predicate:@"-20"];

        CGFloat width = CGRectGetWidth(self.view.bounds) - 80;
        [self.searchButton constrainWidth:[@(width) stringValue]];

    } else {
        self.titleLabel = [[ARSansSerifHeaderLabel alloc] init];
        self.titleLabel.text = [self.selectedTitle uppercaseString];
        self.titleLabel.backgroundColor = [UIColor clearColor];
        self.titleLabel.numberOfLines = 0;
        self.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;

        [self.view addSubview:self.titleLabel];
        NSString *top = [@(10 + ([self.parentViewController isKindOfClass:[UINavigationController class]] ? 20 : 0)) stringValue];
        [self.titleLabel alignTopEdgeWithView:self.view predicate:top];
        [self.titleLabel alignLeading:@"60" trailing:@"-60" toView:self.view];
        [self.titleLabel constrainHeight:@">=44"];
    }

    RAC(self.mapShowMapper, expandAnnotations) = RACObserve(self, expandAnnotations);

    // Due to a problem in the custom UIViewController transitions API (when the VC's view is a scrollview subclass)
    __weak typeof(self) wself = self;
    [[self rac_signalForSelector:@selector(viewWillDisappear:)] subscribeNext:^(id x) {
        __strong typeof (wself) sself = wself;

        CGPoint contentOffset = sself.mapView.contentOffset;

        [[[self rac_signalForSelector:@selector(viewWillAppear:)] take:1] subscribeNext:^(id x) {
            [sself.mapView setContentOffset:contentOffset animated:NO];
        }];
    }];

    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.mapZoomManager setMaxMinZoomScalesForCurrentBounds];
}

- (void)viewDidAppear:(BOOL)animated
{
    if (self.selectedPartnerShows) {
        NSSet *selectedPartnerShowsSet = [NSSet setWithArray:self.selectedPartnerShows];
        [self.mapShowMapper addShows:selectedPartnerShowsSet];
        [self.mapShowMapper selectPartnerShows:self.selectedPartnerShows animated:YES];
        _selectedPartnerShows = nil;
    } else {
        [self.fair downloadShows];
    }

    // Required since, before the view appears, only the annotations *positions* are correct, not their sizes
    [self.mapView updatePositions];

    [super viewDidAppear:animated];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

- (void)setTitleHidden:(BOOL)titleHidden
{
    _titleHidden = titleHidden;

    self.titleLabel.alpha = (titleHidden ? 0.0 : 1.0);
}

- (void)centerMap:(CGFloat)heightRatio inFrameOfHeight:(CGFloat)height animated:(BOOL)animated
{
    CGFloat x = self.mapView.contentOffset.x + (self.mapView.frame.size.width / 2.0f);
    CGFloat y = heightRatio * height + (self.mapView.contentSize.height / 2.0f);
    [self.mapView updateContentOffsetToCenterPoint:CGPointMake(x, y) animated:animated];
}

- (void)mapView:(NAMapView *)imageView tappedOnAnnotation:(ARFairMapAnnotation *)annotation
{
    [self hideCallOut];
    [self showCalloutForAnnotation:annotation animated:YES];
}

- (void)mapView:(NAMapView *)imageView hasChangedZoomLevel:(CGFloat)level
{
    [self hideCallOut];
    [self.mapShowMapper mapZoomLevelChanged:level];
}

- (void)tappedOnMap:(UITapGestureRecognizer *)gestureRecogniser
{
    [self hideCallOut];
}

+ (NSSet *)keyPathsForValuesAffectingHidesBackButton
{
    return [NSSet setWithObjects:@"searchVC.menuState", nil];
}

- (BOOL)hidesNavigationButtons
{
    if (self.searchVC) {
        return YES;
    } else {
        return NO;
    }
}

- (BOOL)hidesToolbarMenu
{
    return YES;
}

- (void)showCalloutForAnnotation:(ARFairMapAnnotation *)annotation animated:(BOOL)animated
{
    [self hideCallOut];

    [self.mapView centerOnPoint:annotation.point animated:animated];

    // The annotation should be highlighted before reduceToPoint is called or it will not get its
    // title label hidden but instead will be completely hidden.
    BOOL wasAnnotationHighlighted = annotation.highlighted;
    annotation.highlighted = YES;
    [(ARFairMapAnnotationView *)annotation.view reduceToPoint];

    if (!annotation.title) {
        return;
    }

    self.calloutView.annotation = annotation;
    self.calloutAnnotationHighlighted = wasAnnotationHighlighted;

    self.calloutView.transform = CGAffineTransformScale(CGAffineTransformIdentity, 0.4f, 0.4f);
    [self.mapView bringSubviewToFront:self.calloutView];
    self.calloutView.hidden = NO;

    [UIView animateIf:animated duration:0.1f:^{
        self.calloutView.transform = CGAffineTransformIdentity;
    }];
}

- (void)hideCallOut
{
    ARFairMapAnnotation *annotation = self.calloutView.annotation;
    if (annotation) {
        annotation.highlighted = self.calloutAnnotationHighlighted;
        [(ARFairMapAnnotationView *)annotation.view expandToFull];
        self.calloutView.hidden = YES;
        self.calloutView.annotation = nil;
        self.calloutAnnotationHighlighted = NO;
    }
}

- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query
{
    ARSwitchBoard *switchboard = ARSwitchBoard.sharedInstance;
    UIViewController *controller = nil;

    // Top two don't need new view controllers
    if (result.model == [Artist class]) {
        Artist *artist = [[Artist alloc] initWithArtistID:result.modelID];
        [self selectedArtist:artist];

    } else if (result.model == [PartnerShow class]) {
        PartnerShow *partnerShow = [[PartnerShow alloc] initWithShowID:result.modelID];
        [self selectedPartnerShow:partnerShow];

    } else if (result.model == [Artwork class]) {
        controller = [switchboard loadArtworkWithID:result.modelID inFair:self.fair];

    } else if (result.model == [Gene class]) {
        controller = [switchboard loadGeneWithID:result.modelID];

    } else if (result.model == [Profile class]) {
        controller = [switchboard loadProfileWithID:result.modelID];
    } else if (result.model == [SiteFeature class]) {
        NSString *path = NSStringWithFormat(@"/feature/%@", result.modelID);
        controller = [switchboard loadPath:path];
    }

    if (controller) {
        [self.ar_TopMenuViewController pushViewController:controller animated:ARPerformWorkAsynchronously];
    }
}

- (void)hideScreenContents
{
    [self cancelledSearch:self.searchVC];
    [self hideCallOut];
}

- (void)selectedPartnerShow:(PartnerShow *)partnerShow
{
    [self hideScreenContents];

    RACCommand *completionCommand = [[[ARTopMenuViewController sharedController] rootNavigationController] presentPendingOperationLayover];

    [ArtsyAPI getShowInfo:partnerShow success:^(PartnerShow *partnerShow) {
        [[completionCommand execute:nil] subscribeCompleted:^{
            [self.mapShowMapper selectPartnerShow:partnerShow animated:YES];
        }];
    } failure:^(NSError *error) {
        [[completionCommand execute:nil] subscribeCompleted:^{
            UIViewController *controller = [ARSwitchBoard.sharedInstance loadShowWithID:partnerShow.showID fair:self.fair];
            [self.navigationController pushViewController:controller animated:YES];
        }];
    }];
}

- (void)selectedArtist:(Artist *)artist
{
    [self hideScreenContents];

    RACCommand *completionCommand = [[[ARTopMenuViewController sharedController] rootNavigationController] presentPendingOperationLayover];

    [ArtsyAPI getShowsForArtistID:artist.artistID inFairID:self.fair.fairID success:^(NSArray *shows) {
        [[completionCommand execute:nil] subscribeCompleted:^{
            [self.mapShowMapper selectPartnerShows:shows animated:YES];
        }];
    } failure:^(NSError *error) {
        [[completionCommand execute:nil] subscribeCompleted:^{
            UIViewController *controller = [ARSwitchBoard.sharedInstance loadArtistWithID:artist.artistID inFair:self.fair];
            [self.ar_TopMenuViewController pushViewController:controller animated:ARPerformWorkAsynchronously];
        }];
    }];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(Fair *)fair change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:ar_keypath(Fair.new, shows)]) {
        // perform the selection on map once we have shows downloaded or loaded from cache
        if (self.selectedPartnerShows) {
            [self.mapShowMapper selectPartnerShows:self.selectedPartnerShows animated:YES];
            _selectedPartnerShows = nil;
        }
    }
}

#pragma mark - ARSearchFieldButtonDelegate

- (void)searchFieldButtonWasPressed:(ARSearchFieldButton *)sender
{
    NSAssert(self.searchVC == nil, @"Trying to replace existing search view controller. ");

    self.searchVC = [[ARFairSearchViewController alloc] initWithFair:self.fair];
    self.searchVC.delegate = self;
    self.searchVC.view.backgroundColor = [UIColor colorWithWhite:1.0 alpha:0.8];
    self.searchButton.hidden = YES;
    [self ar_addModernChildViewController:self.searchVC];
    [self.searchVC.view alignToView:self.navigationController.view];
}

- (void)cancelledSearch:(ARFairSearchViewController *)controller
{
    [self ar_removeChildViewController:self.searchVC];
    self.searchVC = nil;
    self.searchButton.hidden = NO;
}


@end
