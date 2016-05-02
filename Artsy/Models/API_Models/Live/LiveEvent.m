#import "LiveEvent.h"
#import "ARAppConstants.h"
#import "ARLogger.h"
#import "ARMacros.h"


@implementation LiveEvent

+ (instancetype)modelWithDictionary:(NSDictionary *)dictionaryValue error:(NSError *__autoreleasing *)error
{
    NSString *type = [dictionaryValue valueForKeyPath:@"type"];
    Class klass;
    if ([type isEqualToString:@"BiddingOpened"]) {
        klass = LiveEventLotOpen.class;

    } else if ([type isEqualToString:@"FirstPriceBidPlaced"]) {
        klass = LiveEventBid.class;

    } else if ([type isEqualToString:@"fair_warning"]) {
        klass = LiveEventWarning.class;

    } else if ([type isEqualToString:@"final_call"]) {
        klass = LiveEventFinalCall.class;

    } else if ([type isEqualToString:@"BiddingClosed"]) {
        klass = LiveEventClosed.class;

    } else {
        ARErrorLog(@"Error! Unknown event type '%@'", type);
        NSAssert(NO, @"Got an unknown event type");
        return nil;
    }

    return [[klass alloc] initWithDictionary:dictionaryValue error:error];
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LiveEvent.new, eventID) : @"eventId",
        ar_keypath(LiveEventBid.new, source) : @"bidder.type",
    };
}

- (LiveEventType)eventType { return LiveEventTypeUnknown; }

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
