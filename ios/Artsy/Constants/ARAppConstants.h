#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

extern NSString *const ARTestAccountLogin;
extern NSString *const ARTestAccountPassword;

extern const NSTimeInterval ARAnimationQuickDuration;
extern const NSTimeInterval ARAnimationDuration;

extern NSString *const AROAuthTokenKey;
extern NSString *const AROExpiryDateKey;
extern NSString *const ARXAppToken;

extern NSString *const ARAPNSDeviceTokenKey;
extern NSString *const ARAPNSHasSeenPushDialog;

extern NSString *const ARAPNSRecentPushPayloadsKey;

extern NSString *const ARNetworkAvailableNotification;
extern NSString *const ARNetworkUnavailableNotification;

extern NSString *const ARAuctionArtworkBidUpdatedNotification;
extern NSString *const ARAuctionArtworkRegistrationUpdatedNotification;
extern NSString *const ARAuctionSaleOnHoldBannerTappedNotification;
extern NSString *const ARAuctionIDKey;
extern NSString *const ARAuctionArtworkIDKey;

typedef NS_OPTIONS(NSUInteger, ARAuctionState) {
    ARAuctionStateDefault = 0,
    ARAuctionStateStarted = 1 << 0,
    ARAuctionStateEnded = 1 << 1,
    ARAuctionStateShowingPreview = 1 << 2,
    ARAuctionStateUserIsRegistered = 1 << 3,
    ARAuctionStateArtworkHasBids = 1 << 4,
    ARAuctionStateUserIsBidder = 1 << 5,
    ARAuctionStateUserIsHighBidder = 1 << 6,
    ARAuctionStateUserPendingRegistration = 1 << 7,
    ARAuctionStateUserRegistrationClosed = 1 << 8
};

extern BOOL ARPerformWorkAsynchronously;
