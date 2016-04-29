#import "ARTemporaryAPIModule.h"

@implementation ARTemporaryAPIModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(followStatusForArtist:(NSString *)artistID completion:(RCTResponseSenderBlock)block)
{
  self.artistFollowStatusProvider(artistID, block);
}

RCT_EXPORT_METHOD(setFollowStatus:(BOOL)status artistID:(NSString *)artistID completion:(RCTResponseSenderBlock)block)
{
  self.artistFollowStatusAssigner(artistID, status, block);
}

@end