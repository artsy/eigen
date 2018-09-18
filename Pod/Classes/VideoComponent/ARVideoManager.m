#import <AVFoundation/AVFoundation.h>
#import "ARVideoManager.h"


@interface ARVideo : UIView
@property (nonatomic, strong, readwrite) AVPlayer *player;
@property (nonatomic, strong, readwrite) AVPlayerLayer *playerLayer;
@end


@implementation ARVideo

- (void)setFrame:(CGRect)frame
{
    [super setFrame:frame];
    self.playerLayer.frame = self.bounds;
}

- (void)playerDidReachEnd:(NSNotification *)notification {
    AVPlayerItem *playerItem = [notification object];
    [playerItem seekToTime:kCMTimeZero];
    [self.player play];
}

@end


@implementation ARVideoManager
RCT_CUSTOM_VIEW_PROPERTY(source, NSDictionary, ARVideo)
{
    NSDictionary *source = [RCTConvert NSDictionary:json];
    id uri = [source objectForKey:@"uri"];
    view.player = [AVPlayer playerWithURL:[NSURL URLWithString:uri]];
    view.playerLayer = [AVPlayerLayer playerLayerWithPlayer:view.player];
    view.playerLayer.frame = view.bounds;
    [view.layer addSublayer:view.playerLayer];
    [view.player setMuted:true];
    [view.player play];
}

RCT_CUSTOM_VIEW_PROPERTY(size, NSDictionary, ARVideo)
{
    view.frame = [RCTConvert CGRect:json];
}

RCT_CUSTOM_VIEW_PROPERTY(loop, BOOL, ARVideo)
{
    BOOL loop = [RCTConvert BOOL:json];
    if (loop) {
        view.player.actionAtItemEnd = AVPlayerActionAtItemEndNone;
        [[NSNotificationCenter defaultCenter] addObserver:view
                                                 selector:@selector(playerDidReachEnd:)
                                                     name:AVPlayerItemDidPlayToEndTimeNotification
                                                   object:[view.player currentItem]];
    }
}


RCT_EXPORT_MODULE();

- (UIView *)view
{
    ARVideo *video = [ARVideo new];
    return video;
}

@end
