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

NSString *const ARPaymentRequestPaidNotification = @"ARPaymentRequestPaid";
NSString *const ARPaymentRequestURLKey = @"ARPaymentRequestURL";
NSString *const ARLaunchesCountKey = @"ARLaunchesCountKey";

NSString *const ARAPNSDeviceTokenKey = @"apns_device_token";

BOOL ARPerformWorkAsynchronously = YES;

#ifdef DEMO_MODE
const BOOL ARIsRunningInDemoMode = YES;
#else
const BOOL ARIsRunningInDemoMode = NO;
#endif
