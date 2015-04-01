#import "NotificationController.h"

@interface NotificationController()
@property (strong, nonatomic) IBOutlet WKInterfaceImage *image;
@property (strong, nonatomic) IBOutlet WKInterfaceGroup *notificationGroup;

@property (strong, nonatomic) IBOutlet WKInterfaceLabel *artistNameLabel;
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *artworkTitleLabel;
@end

@implementation NotificationController

- (void)didReceiveLocalNotification:(UILocalNotification *)localNotification withCompletion:(void (^)(WKUserNotificationInterfaceType))completionHandler 
 {
     [self didReceiveRemoteNotification:localNotification.userInfo withCompletion:completionHandler];
}

- (void)didReceiveRemoteNotification:(NSDictionary *)remoteNotification withCompletion:(void (^)(WKUserNotificationInterfaceType))completionHandler
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

        NSString *address = remoteNotification[@"aps"][@"image_url"];

        NSURL *url = [NSURL URLWithString:address];
        NSData *data = [NSData dataWithContentsOfURL:url];
        UIImage *placeholder = [UIImage imageWithData:data];

        dispatch_async(dispatch_get_main_queue(), ^{
            [self.notificationGroup setBackgroundImage:placeholder];
        });
    });

    [self.artistNameLabel setText:remoteNotification[@"aps"][@"artwork_artist"]];
    [self.artworkTitleLabel setText:remoteNotification[@"aps"][@"artwork_title"]];

    ARWatchBidDetails = [[WatchBiddingDetails alloc] initWithDictionary:remoteNotification[@"aps"]];

    completionHandler(WKUserNotificationInterfaceTypeCustom);
}

static WatchBiddingDetails *ARWatchBidDetails;

+ (WatchBiddingDetails *)biddingDetailsFromNotification
{
    return ARWatchBidDetails;
}

@end
