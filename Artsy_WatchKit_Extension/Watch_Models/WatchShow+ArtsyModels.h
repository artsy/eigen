#import "WatchShow.h"

@class PartnerShow;

@interface WatchShow (FromShow)

- (instancetype)initWithArtsyPartnerShow:(PartnerShow *)show;
- (instancetype)initWithArtsyPartnerShow:(PartnerShow *)show atLocation:(CLLocation *)location;

@end
