#import "ARAppConstants.h"

// Don't go wild, this is just a standard account I
// signed up with one day.
NSString *const ARTestAccountLogin = @"energy_test_bot@gmail.com";
NSString *const ARTestAccountPassword = @"zaqwsxcde";

const NSTimeInterval ARAnimationQuickDuration = 0.15;
const NSTimeInterval ARAnimationDuration = 0.3;

NSString *const AROExpiryDateKey = @"expires_in";
NSString *const ARXAppToken = @"xapp_token";

NSString *const AROAuthTokenKey = @"access_token";

NSString *const ARNetworkAvailableNotification = @"network_available_notification";
NSString *const ARNetworkUnavailableNotification = @"network_unavailable_notification";

NSString *const ARAuctionArtworkBidUpdatedNotification = @"ARAuctionArtworkBidUpdated";
NSString *const ARAuctionArtworkRegistrationUpdatedNotification = @"ARAuctionArtworkRegistrationUpdated";
NSString *const ARAuctionSaleOnHoldBannerTappedNotification = @"ARAuctionSaleOnHoldBannerTappedNotification";
NSString *const ARAuctionIDKey = @"ARAuctionID";
NSString *const ARAuctionArtworkIDKey = @"ARAuctionArtworkID";

NSString *const ARAPNSDeviceTokenKey = @"apns_device_token";
NSString *const ARAPNSHasSeenPushDialog = @"apns_has_seen_push_dialog";

NSString *const ARAPNSRecentPushPayloadsKey = @"apns_recent_push_payloads";

BOOL ARPerformWorkAsynchronously = YES;
