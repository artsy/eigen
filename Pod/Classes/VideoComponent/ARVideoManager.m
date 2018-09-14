#import <AVFoundation/AVFoundation.h>
#import "ARVideoManager.h"


@interface ARVideo : UIView
@property (nonatomic, strong, readwrite) AVPlayerLayer *playerLayer;
@end


@implementation ARVideo

- (void)setFrame:(CGRect)frame
{
    [super setFrame:frame];
    self.playerLayer.frame = self.bounds;
}

@end


@implementation ARVideoManager
RCT_CUSTOM_VIEW_PROPERTY(source, NSDictionary, ARVideo)
{
    NSDictionary *source = [RCTConvert NSDictionary:json];
    id uri = [source objectForKey:@"uri"];
    AVPlayer *player = [AVPlayer playerWithURL:[NSURL URLWithString:uri]];
    view.playerLayer = [AVPlayerLayer playerLayerWithPlayer:player];
    view.playerLayer.frame = view.bounds;
    [view.layer addSublayer:view.playerLayer];
    [player setMuted:true];
    [player play];
}

RCT_CUSTOM_VIEW_PROPERTY(size, NSDictionary, ARVideo)
{
    view.frame = [RCTConvert CGRect:json];
}


RCT_EXPORT_MODULE();

- (UIView *)view
{
    ARVideo *video = [ARVideo new];
    return video;
}

@end
