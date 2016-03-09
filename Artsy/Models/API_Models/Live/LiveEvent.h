#import <Mantle/Mantle.h>

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
@end


@interface LiveEventLotOpen : LiveEvent

@end


@interface LiveEventBid : LiveEvent
@property (nonatomic, assign, readonly) NSInteger amountCents;
@property (nonatomic, copy, readonly) NSString *source;
@property (nonatomic, assign, readonly) BOOL isConfirmed;
@end


@interface LiveEventWarning : LiveEvent
@end


@interface LiveEventFinalCall : LiveEvent
@end


@interface LiveEventClosed : LiveEvent
@end
