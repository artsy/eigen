@class AROfflineView;


@interface ARShowFeedNetworkStatusModel : NSObject

- (instancetype)initWithShowFeedVC:(ARSimpleShowFeedViewController *)showFeedVC;

@property (nonatomic, readonly, getter=isShowingOfflineView) BOOL showingOfflineView;

@property (nonatomic, strong) AROfflineView *offlineView;

- (void)showOfflineView;
- (void)hideOfflineView;

@end
