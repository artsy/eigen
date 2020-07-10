#import "ARTemporaryAPIModule.h"

@implementation ARTemporaryAPIModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(markNotificationsRead:(RCTResponseSenderBlock)block)
{
    /* In eigen, this should mark the notifications as read using ArtsyAPI */
    self.notificationReadStatusAssigner(block);
}

RCT_EXPORT_METHOD(presentAugmentedRealityVIR:(NSString *)imgUrl width:(CGFloat)widthIn height:(CGFloat)heightIn artworkSlug:(NSString *)artworkSlug artworkId:(NSString *)artworkId)
{
    self.augmentedRealityVIRPresenter(imgUrl, widthIn, heightIn, artworkSlug, artworkId);
}

RCT_EXPORT_METHOD(setApplicationIconBadgeNumber:(nonnull NSNumber *)count)
{
    __block int icount = [count intValue];
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication sharedApplication].applicationIconBadgeNumber = icount;
    });
}


@end
