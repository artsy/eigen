/// This exists purely because we don't want to have to disambiguate between this tableView
/// and the Gene and Search ones in personalize


@interface AROnboardingArtistTableController : NSObject <UITableViewDataSource, UITableViewDelegate>

@property (nonatomic, readonly) NSMutableOrderedSet *artists;

// It was either this or KVO
@property (nonatomic, copy) void (^postRemoveBlock)(void);

- (void)addArtist:(Artist *)artist;
- (void)removeArtist:(Artist *)artist;
- (BOOL)hasArtist:(Artist *)artist;
- (void)prepareTableView:(UITableView *)tableView;
- (void)unfollowArtist:(Artist *)artist;

@end
