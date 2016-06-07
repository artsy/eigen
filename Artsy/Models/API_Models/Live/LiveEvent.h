#import <Mantle/Mantle.h>

NS_ASSUME_NONNULL_BEGIN

@class LiveBidder;

typedef NS_ENUM(NSInteger, LiveEventType) {
    LiveEventTypeLotOpen,
    LiveEventTypeBid,
    LiveEventTypeWarning,
    LiveEventTypeFinalCall,
    LiveEventTypeClosed,
    LiveEventTypeBidComposite,
    LiveEventTypeUndo,
    LiveEventTypeUnknown
};


@interface LiveEvent : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *type;
@property (nonatomic, copy, readonly) NSString *eventID;

/// We get a lot of JSON to parse, and this property is rarely used
/// so I'm saving on converting this string into an NSDate till it's needed
@property (nonatomic, copy, readonly) NSString *createdAtString;

- (LiveEventType)eventType;

// This is not optimal, I will have to find a way to do this better in the future.
// Than the pattern in ContentLink.m

// We do this to expose these to its children

@property (nonatomic, assign, readonly) UInt64 amountCents;
@property (nonatomic, strong, readonly) LiveBidder *_Nullable bidder;

/// Used by `LiveEventUndo` and `LiveEventBidComposite`
@property (nonatomic, copy, readonly) NSString *hostedEventID;

// In theory only LiveEventBid, LiveEventLotOpen
// LiveEventClosed, LiveEventBidComposite
@property (nonatomic, assign) BOOL cancelled;

// Used by only LiveEventBid
@property (nonatomic, assign) BOOL confirmed;

@end


@interface LiveEventLotOpen : LiveEvent
@end


@interface LiveEventBid : LiveEvent
- (NSString *)displayString;
@end


@interface LiveEventWarning : LiveEvent
@end


@interface LiveEventFinalCall : LiveEvent
@end


@interface LiveEventClosed : LiveEvent
@end


@interface LiveEventBidComposite : LiveEvent
@end


@interface LiveEventUndo : LiveEvent
@end

NS_ASSUME_NONNULL_END
