@class ARArtworkViewController;

@interface ARArtworkSetViewController : UIPageViewController <UIPageViewControllerDataSource, UIPageViewControllerDelegate>

- (instancetype)initWithArtworkID:(NSString *)artworkID;
- (instancetype)initWithArtworkID:(NSString *)artworkID fair:(Fair *)fair;

- (instancetype)initWithArtwork:(Artwork *)artwork;
- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair;

- (instancetype)initWithArtworkSet:(NSArray *)artworkSet;
- (instancetype)initWithArtworkSet:(NSArray *)artworkSet fair:(Fair *)fair;

- (instancetype)initWithArtworkSet:(NSArray *)artworkSet atIndex:(NSInteger)index;
- (instancetype)initWithArtworkSet:(NSArray *)artworkSet fair:(Fair *)fair atIndex:(NSInteger)index;
- (instancetype)initWithArtworkSet:(NSArray *)artworkSet fair:(Fair *)fair show:(PartnerShow *)show atIndex:(NSInteger)index;

- (ARArtworkViewController *)currentArtworkViewController;

@property (nonatomic, assign, readonly) NSInteger index;
@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, strong, readonly) PartnerShow *show;

@end
