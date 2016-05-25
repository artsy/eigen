#import "LiveEvent.h"
#import "ARAppConstants.h"
#import "ARLogger.h"
#import "ARMacros.h"
#import "LiveBidder.h"
#import "ARDeveloperOptions.h"


@implementation LiveEvent

+ (instancetype)modelWithDictionary:(NSDictionary *)dictionaryValue error:(NSError *__autoreleasing *)error
{
    /*
     We need to support the following event types:
     - ReservePriceChanged
     - CompositeOnlineBidConfirmed
     - BidCancelled
    */
    NSString *type = [dictionaryValue valueForKeyPath:@"type"];
    Class klass;
    if ([type isEqualToString:@"BiddingOpened"]) {
        klass = LiveEventLotOpen.class;

    } else if ([type isEqualToString:@"FirstPriceBidPlaced"] || [type isEqualToString:@"SecondPriceBidPlaced"] || [type isEqualToString:@"CompositeOnlineBidConfirmed"]) {
        klass = LiveEventBid.class;

    } else if ([type isEqualToString:@"FairWarning"]) {
        klass = LiveEventWarning.class;

    } else if ([type isEqualToString:@"FinalCall"]) {
        klass = LiveEventFinalCall.class;

    } else if ([type isEqualToString:@"BiddingClosed"]) {
        klass = LiveEventClosed.class;

    } else {
        ARErrorLog(@"Error! Ignoring unknown event type '%@'\nEvent: %@", type, dictionaryValue);
        return nil;
    }

    if ([ARDeveloperOptions options][@"log_live_events"]) {
        NSLog(@"Live Event: %@", dictionaryValue);
    }

    return [[klass alloc] initWithDictionary:dictionaryValue error:error];
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LiveEvent.new, eventID) : @"eventId",
        ar_keypath(LiveEvent.new, createdAtString) : @"createdAt",
    };
}

+ (NSValueTransformer *)bidderJSONTransformer
{
    return [NSValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[LiveBidder class]];
}

- (LiveEventType)eventType { return LiveEventTypeUnknown; }

- (NSString *)sourceOrDefaultString
{
    if (self.bidder == nil) {
        return @"Bid";
    } else {
        return self.bidder.bidderDisplayType;
    }
}

@end


@implementation LiveEventLotOpen
- (LiveEventType)eventType { return LiveEventTypeLotOpen; }
@end


@implementation LiveEventBid
- (LiveEventType)eventType { return LiveEventTypeBid; }
@end


@implementation LiveEventWarning
- (LiveEventType)eventType { return LiveEventTypeWarning; }
@end


@implementation LiveEventFinalCall
- (LiveEventType)eventType { return LiveEventTypeFinalCall; }
@end


@implementation LiveEventClosed
- (LiveEventType)eventType { return LiveEventTypeClosed; }
@end
