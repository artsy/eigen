#import "ARTemporaryAPIModule.h"

@implementation ARTemporaryAPIModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(followStatusForArtist:(NSString *)artistID completion:(RCTResponseSenderBlock)block)
{
  self.artistFollowStatusProvider(artistID, block);
}

RCT_EXPORT_METHOD(setFollowArtistStatus:(BOOL)status artistID:(NSString *)artistID completion:(RCTResponseSenderBlock)block)
{
  self.artistFollowStatusAssigner(artistID, status, block);
}

RCT_EXPORT_METHOD(followStatusForGene:(NSString *)geneID completion:(RCTResponseSenderBlock)block)
{
    self.geneFollowStatusProvider(geneID, block);
}

RCT_EXPORT_METHOD(setFollowGeneStatus:(BOOL)status geneID:(NSString *)geneID completion:(RCTResponseSenderBlock)block)
{
    self.geneFollowStatusAssigner(geneID, status, block);
}

RCT_EXPORT_METHOD(markNotificationsRead:(RCTResponseSenderBlock)block)
{
    /* In eigen, this should mark the notifications as read using ArtsyAPI */
    self.notificationReadStatusAssigner(block);
}

RCT_EXPORT_METHOD(presentAugmentedRealityVIR:(NSString *)imgUrl width:(CGFloat)width height:(CGFloat)height artworkSlug:(NSString *)artworkSlug artworkId:(NSString *)artworkId)
{
    self.augmentedRealityVIRPresenter(imgUrl, width, height, artworkSlug, artworkId);
}

@end
