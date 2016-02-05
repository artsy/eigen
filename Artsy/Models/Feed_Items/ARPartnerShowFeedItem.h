#import "ARFeedItem.h"

@class PartnerShow;

@interface ARPartnerShowFeedItem : ARFeedItem

@property (nonatomic, strong, readonly) PartnerShow *show;
@property (nonatomic, copy, readonly) NSString *showID;

@end
