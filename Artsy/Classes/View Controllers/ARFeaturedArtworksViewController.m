#import "ARFeaturedArtworksViewController.h"
#import "ARArtworkWithMetadataThumbnailCell.h"
#import "ARArtworkSetViewController.h"

static NSString *FeaturedArtworkCellID = @"FeaturedArtworkCellID";
static CGFloat ARFeaturedArtworksCellHeight = 260;

@interface ARFeaturedArtworksViewController ()
@property (nonatomic, strong, readwrite) NSArray *artworks;
@end

@implementation ARFeaturedArtworksViewController

- (instancetype)init
{
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    layout.minimumInteritemSpacing = 20;
    layout.scrollDirection = UICollectionViewScrollDirectionHorizontal;
    self = [super initWithCollectionViewLayout:layout];
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.collectionView registerClass:[ARArtworkWithMetadataThumbnailCell class] forCellWithReuseIdentifier:FeaturedArtworkCellID];

    [self.view constrainHeight:NSStringWithFormat(@"%f", [self preferredContentSize].height)];

    self.collectionView.backgroundColor = [UIColor whiteColor];
    self.collectionView.dataSource = self;
    self.collectionView.delegate = self;
    self.collectionView.showsHorizontalScrollIndicator = NO;
    self.collectionView.scrollsToTop = NO;
    self.collectionView.contentInset = UIEdgeInsetsMake(0, [UIDevice isPad] ? 50 : 20, 0, 0);
}

- (void)setArtworks:(NSArray *)artworks
{
    if ([artworks isEqualToArray:_artworks]) {
        return;
    }
    _artworks = artworks;
    [self.collectionView reloadData];
    [self.collectionView.collectionViewLayout invalidateLayout];
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return self.artworks.count;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    CGFloat imageHeight = ARFeaturedArtworksCellHeight - [ARArtworkWithMetadataThumbnailCell heightForMetaData];
    return CGSizeMake(imageHeight, ARFeaturedArtworksCellHeight);
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    ARArtworkWithMetadataThumbnailCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:FeaturedArtworkCellID forIndexPath:indexPath];
    Artwork *artwork = _artworks[indexPath.row];
    [cell setupWithRepresentedObject:artwork];
    return cell;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtworkSet:_artworks inFair:nil atIndex:indexPath.row];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (CGSize)preferredContentSize
{
    return CGSizeMake(UIViewNoIntrinsicMetric, ARFeaturedArtworksCellHeight);
}

@end
