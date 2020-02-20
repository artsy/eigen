#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

typedef void(^ARArtistFollowStatusProvider)(NSString *artistID, RCTResponseSenderBlock block);
typedef void(^ARArtistFollowStatusAssigner)(NSString *artistID, BOOL following, RCTResponseSenderBlock block);

typedef void(^ARGeneFollowStatusProvider)(NSString *geneID, RCTResponseSenderBlock block);
typedef void(^ARGeneFollowStatusAssigner)(NSString *geneID, BOOL following, RCTResponseSenderBlock block);

typedef void(^ARNotificationReadStatusAssigner)(RCTResponseSenderBlock block);

typedef void(^ARAugmentedRealityVIRPresenter)(NSString *imgUrl, CGFloat widthIn, CGFloat heightIn, NSString *artworkSlug, NSString *artworkId);

/// While metaphysics is read-only, we need to rely on Eigen's
/// v1 API access to get/set these bits of information.

@interface ARTemporaryAPIModule : NSObject <RCTBridgeModule>

@property (nonatomic, copy, readwrite) ARArtistFollowStatusProvider artistFollowStatusProvider;
@property (nonatomic, copy, readwrite) ARArtistFollowStatusAssigner artistFollowStatusAssigner;

@property (nonatomic, copy, readwrite) ARGeneFollowStatusProvider geneFollowStatusProvider;
@property (nonatomic, copy, readwrite) ARGeneFollowStatusAssigner geneFollowStatusAssigner;

@property (nonatomic, copy, readwrite) ARNotificationReadStatusAssigner notificationReadStatusAssigner;

@property (nonatomic, copy, readwrite) ARAugmentedRealityVIRPresenter augmentedRealityVIRPresenter;

@end
