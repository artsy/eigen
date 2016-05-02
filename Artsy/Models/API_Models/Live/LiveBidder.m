#import "ARMacros.h"
#import "LiveBidder.h"


@implementation LiveBidder

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LiveBidder.new, type) : @"type",
        ar_keypath(LiveBidder.new, bidderID) : @"bidderId",
    };
}

@end
