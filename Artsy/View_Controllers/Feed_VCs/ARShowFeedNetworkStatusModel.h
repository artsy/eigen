#import <Foundation/Foundation.h>

@class ARSimpleShowFeedViewController, AROfflineView;


@interface ARShowFeedNetworkStatusModel : NSObject

- (instancetype)initWithShowFeedVC:(ARSimpleShowFeedViewController *)showFeedVC;

@property (nonatomic, readonly, getter=isShowingOfflineView) BOOL showingOfflineView;

@property (nonatomic, readonly, strong) AROfflineView *offlineView;

- (void)showOfflineViewIfNeeded;
- (void)showOfflineView;
- (void)hideOfflineView;

@end
