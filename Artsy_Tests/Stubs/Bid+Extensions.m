#import "Bid+Extensions.h"


@implementation Bid (Extensions)

+ (Bid *)bidWithCents:(NSNumber *)cents bidID:(NSString *)bidID
{
    return [Bid modelWithJSON:@{ @"cents" : cents,
                                 @"id" : bidID }];
}

@end
