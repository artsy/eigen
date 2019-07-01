@class Artwork, ARArtworkViewController, Fair;


@interface ARArtworkSetViewController : UIPageViewController <UIPageViewControllerDataSource, UIPageViewControllerDelegate>

- (instancetype)initWithArtworkID:(NSString *)artworkID;
- (instancetype)initWithArtworkID:(NSString *)artworkID fair:(Fair *)fair;

- (instancetype)initWithArtwork:(Artwork *)artwork;
- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair;

- (instancetype)initWithArtworkSet:(NSArray<Artwork *> *)artworkSet;
- (instancetype)initWithArtworkSet:(NSArray<Artwork *> *)artworkSet fair:(Fair *)fair;

- (instancetype)initWithArtworkSet:(NSArray<Artwork *> *)artworkSet atIndex:(NSInteger)index;
- (instancetype)initWithArtworkSet:(NSArray<Artwork *> *)artworkSet fair:(Fair *)fair atIndex:(NSInteger)index;

- (ARArtworkViewController *)currentArtworkViewController;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, strong, readonly) NSArray<Artwork *> *artworks;
@property (nonatomic, assign, readonly) NSInteger index;

@end
