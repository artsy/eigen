#import <UIKit/UIKit.h>

@class AROfflineView;

@protocol AROfflineViewDelegate
- (void)offlineViewDidRequestRefresh:(AROfflineView *)offlineView;
@end


@interface AROfflineView : UIView
@property (readwrite, nonatomic, weak) id<AROfflineViewDelegate> delegate;
- (void)refreshFailed;
@end
