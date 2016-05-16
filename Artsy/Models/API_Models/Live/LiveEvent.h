#import <Mantle/Mantle.h>

NS_ASSUME_NONNULL_BEGIN

@class LiveBidder;

typedef NS_ENUM(NSInteger, LiveEventType) {
    LiveEventTypeLotOpen,
    LiveEventTypeBid,
    LiveEventTypeWarning,
    LiveEventTypeFinalCall,
    LiveEventTypeClosed,
    LiveEventTypeUnknown
};


@interface LiveEvent : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *type;
@property (nonatomic, copy, readonly) NSString *eventID;
- (LiveEventType)eventType;

// This is not optimal, I will have to find a way to do this better in the future.
// Than the pattern in ContentLink.m

// We do this to expose these to its children

@property (nonatomic, assign, readonly) UInt64 amountCents;
@property (nonatomic, strong, readonly) LiveBidder *_Nullable bidder;
@property (nonatomic, strong, readonly) NSString *sourceOrDefaultString;

@end


@interface LiveEventLotOpen : LiveEvent

@end


@interface LiveEventBid : LiveEvent
@end


@interface LiveEventWarning : LiveEvent
@end


@interface LiveEventFinalCall : LiveEvent
@end


@interface LiveEventClosed : LiveEvent
@end

NS_ASSUME_NONNULL_END
