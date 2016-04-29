#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

typedef void(^ARArtistFollowStatusProvider)(NSString *artistID, RCTResponseSenderBlock block);
typedef void(^ARArtistFollowStatusAssigner)(NSString *artistID, BOOL following, RCTResponseSenderBlock block);

@interface ARTemporaryAPIModule : NSObject <RCTBridgeModule>

@property (nonatomic, copy, readwrite) ARArtistFollowStatusProvider artistFollowStatusProvider;
@property (nonatomic, copy, readwrite) ARArtistFollowStatusAssigner artistFollowStatusAssigner;

@end
