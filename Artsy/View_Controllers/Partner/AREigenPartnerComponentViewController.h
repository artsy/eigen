#import "ARPartnerComponentViewController.h"
#import "ARMenuAwareViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface AREigenPartnerComponentViewController : UIViewController <ARMenuAwareViewController>

- (instancetype)initWithPartnerID:(NSString *)partnerID;

@end

NS_ASSUME_NONNULL_END
