#import "ARInternalMobileWebViewController.h"

#import "ARMacros.h"

@interface ARAuctionWebViewController : ARInternalMobileWebViewController

@property (nonatomic, strong, readonly) NSString *auctionID;
@property (nonatomic, strong, readonly) NSString *artworkID;

- (instancetype)initWithURL:(NSURL *)URL;

- (instancetype)initWithURL:(NSURL *)URL
                  auctionID:(NSString *)auctionID
                  artworkID:(NSString *)artworkID AR_VC_DESIGNATED_INITIALIZER;

@end
