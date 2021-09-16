#import "ARMacros.h"
#import "LiveBidder.h"


@implementation LiveBidder

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LiveBidder.new, bidderID) : @"bidderId",
    };
}

- (NSString *)bidderDisplayType
{
    if ([self.type isEqualToString:@"OfflineBidder"]) {
        return @"Floor";
    } else {
        return self.paddleNumber.length ? self.paddleNumber : self.bidderID;
    }
}

@end
