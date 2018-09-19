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
    bool isNetwork = [RCTConvert BOOL:[source objectForKey:@"isNetwork"]];
    bool isAsset = [RCTConvert BOOL:[source objectForKey:@"isAsset"]];
    NSString *uri = [source objectForKey:@"uri"];
    NSString *type = [source objectForKey:@"type"];
    NSString *resizeMode = [source objectForKey:@"resizeMode"];

    NSString *videoGravity;
    if ([resizeMode isEqualToString:@"stretch"]) {
        videoGravity = AVLayerVideoGravityResize;
    } else if ([resizeMode isEqualToString:@"contain"]) {
        videoGravity = AVLayerVideoGravityResizeAspect;
    } else if ([resizeMode isEqualToString:@"cover"]) {
        videoGravity = AVLayerVideoGravityResizeAspectFill;
    } else {
        videoGravity = AVLayerVideoGravityResizeAspect;
    }

    NSURL *url = isNetwork || isAsset
        ? [NSURL URLWithString:uri]
        : [[NSURL alloc] initFileURLWithPath:[[NSBundle mainBundle] pathForResource:uri ofType:type]];

    view.player = [AVPlayer playerWithURL:url];
    view.playerLayer = [AVPlayerLayer playerLayerWithPlayer:view.player];
    view.playerLayer.frame = view.bounds;
    view.playerLayer.videoGravity = videoGravity;
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


RCT_EXPORT_MODULE(ARVideo);

- (UIView *)view
{
    ARVideo *video = [ARVideo new];
    return video;
}

@end
