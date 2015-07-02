extern const NSString *ARTestAccountLogin;
extern const NSString *ARTestAccountPassword;

extern const CGFloat ARAnimationQuickDuration;
extern const CGFloat ARAnimationDuration;

extern const NSString *AROAuthTokenKey;
extern const NSString *AROExpiryDateKey;
extern const NSString *ARXAppToken;

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
