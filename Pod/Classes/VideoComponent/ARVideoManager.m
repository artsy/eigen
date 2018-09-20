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

// Loop

- (void)playerDidReachEnd:(NSNotification *)notification
{
    AVPlayerItem *playerItem = [notification object];
    [playerItem seekToTime:kCMTimeZero];
    [self.player play];
}

// We want to know how large the video is to be able to set the player positioning ourselves
// because we want to have a left-aligned video, instead of the default center aligned fill.

- (void)observeValueForKeyPath:(NSString *)path ofObject:(id)object change:(NSDictionary *)change context:(void *) context
{
    // Only do the positioning logic for aspect fills
    if (self.playerLayer.videoGravity == AVLayerVideoGravityResizeAspectFill && [path isEqualToString:@"readyForDisplay"]) {
        CGRect videoRect = self.playerLayer.videoRect;
        
        if (!CGRectIsEmpty(videoRect)) {
            // Ok, now we've got enough info to handle the sizing
            [self updatePlayerLayerFrame];
            
            // Animate in the video
            self.layer.opacity = 1;
        }
    } else {
        [super observeValueForKeyPath:path ofObject:object change:change context:context];
    }
}

- (void)updatePlayerLayerFrame
{
    if (!self.player.currentItem) {
        return;
    }
    // Get the right size for the video
    AVPlayerItem *item = self.player.currentItem;
    AVPlayerItemTrack *track = [item tracks][0];
    CGSize naturalVideoSize = track.assetTrack.naturalSize;
    
    // Figure our how it would fit un-cropped in aspect fill
    CGFloat aspectRatio = naturalVideoSize.width / naturalVideoSize.height;
    CGRect playerBounds = CGRectMake(0, 0, self.superview.bounds.size.height * aspectRatio, self.superview.bounds.size.height);
    
    // Don't animate setting the positioning of the video
    [CATransaction begin];
    [CATransaction setAnimationDuration:0];
    self.playerLayer.frame = playerBounds;
    [CATransaction commit];
}

// We need to do some memory management to make sure we don't keep a connection to the AVPlayer

- (void)dealloc
{
    [self.playerLayer removeObserver:self forKeyPath:@"readyForDisplay"];
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
    view.playerLayer.frame = view.bounds; //CGRectInset(view.bounds, 20, 20);
    view.playerLayer.videoGravity = videoGravity;
    
    // Always listen for the video being set, it's a bit overkill, but it simplifies the dealloc logic
    [view.playerLayer addObserver:view forKeyPath:@"readyForDisplay" options:NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew context:NULL];

    // Hide the video so that we don't get the default (center) gravity for a fill, before we get the callback via KVO above
    if ([videoGravity isEqualToString:@"cover"] ) {
        view.layer.opacity = 0;
    }
    
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
