#import "WatchShow.h"

/// This file is only in the Artsy Target


@interface WatchShow (FromShow)

- (instancetype)initWithArtsyPartnerShow:(PartnerShow *)show;
- (instancetype)initWithArtsyPartnerShow:(PartnerShow *)show atLocation:(CLLocation *)location;

@end
