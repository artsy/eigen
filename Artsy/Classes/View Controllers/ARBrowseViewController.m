#import "ARBrowseViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARBrowseFeaturedLinksCollectionViewCell.h"
#import "ARBrowseNetworkModel.h"

@interface ARBrowseViewCell : ARBrowseFeaturedLinksCollectionViewCell
@end

@implementation ARBrowseViewCell

- (void)setupTitleLabel
{
    [self.titleLabel setFont:[self.titleLabel.font fontWithSize:16]];
    [self.titleLabel constrainWidthToView:self.contentView predicate:@"-26"];
    [self.titleLabel alignTop:nil leading:@"13" bottom:@"-13" trailing:nil toView:self.contentView];
}

@end

/////////////////

@interface ARBrowseViewController () <UICollectionViewDataSource, UICollectionViewDelegate>
@property (nonatomic, strong, readwrite) NSArray *menuLinks;
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@property (nonatomic, strong, readonly) ARBrowseNetworkModel *networkModel;
@end

@implementation ARBrowseViewController

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }
    _shouldAnimate = YES;
    _networkModel = [[ARBrowseNetworkModel alloc] init];
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];

    [self setupCollectionView];
    [self.collectionView registerClass:[ARBrowseViewCell class] forCellWithReuseIdentifier:[ARBrowseViewCell reuseID]];

    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self ar_presentIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
    [self fetchMenuItems];
}

- (void)setupCollectionView
{
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    layout.itemSize = CGSizeMake(280, 144);
    layout.minimumLineSpacing = 13;
    layout.sectionInset = UIEdgeInsetsMake(20, 20, 20, 20);
    UICollectionView *collectionView = [[UICollectionView alloc] initWithFrame:CGRectZero collectionViewLayout:layout];
    collectionView.dataSource = self;
    collectionView.delegate = self;
    collectionView.backgroundColor = [UIColor whiteColor];

    [self.view addSubview:collectionView];

    [collectionView alignToView:self.view];
    _collectionView = collectionView;
}

- (void)fetchMenuItems
{
    [self.networkModel getBrowseFeaturedLinks:^(NSArray *links) {
        [self.collectionView reloadData];
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
    } failure:^(NSError *error) {
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
    }];
}

- (NSArray *)menuLinks
{
    return self.networkModel.links;
}

#pragma mark - UITableViewDelegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    FeaturedLink *link = [self.menuLinks objectAtIndex:indexPath.row];
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:link.href];
    if (viewController) {
        [self.navigationController pushViewController:viewController animated:YES];
    }
}

#pragma mark - UICollectionViewDataSource

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    ARBrowseViewCell *cell = (id)[self.collectionView dequeueReusableCellWithReuseIdentifier:[ARBrowseViewCell reuseID] forIndexPath:indexPath];
    FeaturedLink *link = self.menuLinks[indexPath.row];
    [cell updateWithTitle:link.title imageURL:link.largeImageURL];

    return cell;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return self.menuLinks.count;
}

#pragma mark - Orientation

-(NSUInteger)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

@end

