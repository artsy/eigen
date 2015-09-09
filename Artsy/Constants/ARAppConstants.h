extern NSString *const ARTestAccountLogin;
extern NSString *const ARTestAccountPassword;

extern const CGFloat ARAnimationQuickDuration;
extern const CGFloat ARAnimationDuration;

extern NSString *const AROAuthTokenKey;
extern NSString *const AROExpiryDateKey;
extern NSString *const ARXAppToken;

extern NSString *const ARAPNSDeviceTokenKey;

extern NSString *const ARNetworkAvailableNotification;
extern NSString *const ARNetworkUnavailableNotification;

typedef NS_OPTIONS(NSUInteger, ARAuctionState) {
    ARAuctionStateDefault = 0,
    ARAuctionStateStarted = 1 << 0,
    ARAuctionStateEnded = 1 << 1,
    ARAuctionStateUserIsRegistered = 1 << 2,
    ARAuctionStateArtworkHasBids = 1 << 3,
    ARAuctionStateUserIsBidder = 1 << 4,
    ARAuctionStateUserIsHighBidder = 1 << 5
};

extern BOOL ARPerformWorkAsynchronously;
