#import "AREmbeddedModelsViewController.h"
#import "ARWorksForYouNotificationItem.h"

#import <ORStackView/ORStackView.h>
#import <UIKit/UIKit.h>

@protocol ARWorkForYouNotificationViewDelegate <NSObject>

- (void)didSelectArtist:(Artist *)artist;

@end


@interface ARWorksForYouNotificationView : ORStackView

@property (nonatomic, weak) id<ARWorkForYouNotificationViewDelegate> delegate;

- (instancetype)initWithNotificationItem:(ARWorksForYouNotificationItem *)notificationItem artworksViewController:(AREmbeddedModelsViewController *)artworksVC;

@end
