#import "ARAnimationContinuation.h"

#import <QuartzCore/QuartzCore.h>
#import <UIKit/UIKit.h>

static NSString * const LayerKey = @"ARAnimationContinuation";

@interface ARAnimationContinuation ()
@property (nonatomic, weak, readwrite) CALayer *layer;
@property (nonatomic, copy, readwrite) NSDictionary *animations;
@end

@implementation ARAnimationContinuation

+ (void)addToLayer:(CALayer *)layer;
{
    if ([layer valueForKey:LayerKey] == nil) {
        [layer setValue:[[self alloc] initWithLayer:layer] forKey:LayerKey];
    }
}

+ (void)removeFromLayer:(CALayer *)layer;
{
    [layer setValue:nil forKey:LayerKey];
}

- (void)dealloc;
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithLayer:(CALayer *)layer;
{
    if ((self = [super init])) {
        _layer = layer;
        _animations = @{};

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(pauseAnimations)
                                                     name:UIApplicationDidEnterBackgroundNotification
                                                   object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(resumeAnimations)
                                                     name:UIApplicationWillEnterForegroundNotification
                                                   object:nil];
    }
    return self;
}

#pragma mark - Pause/Resume

// As per https://developer.apple.com/library/ios/qa/qa1673/_index.html

-(void)pauseAnimations;
{
    CALayer *layer = self.layer;

    NSArray *keys = layer.animationKeys;
    NSMutableDictionary *animations = [[NSMutableDictionary alloc] initWithCapacity:keys.count];
    for (NSString *key in keys) {
        animations[key] = [layer animationForKey:key];
    }
    self.animations = animations;
    [layer removeAllAnimations];

    CFTimeInterval pausedTime = [layer convertTime:CACurrentMediaTime() fromLayer:nil];
    layer.speed = 0.0;
    layer.timeOffset = pausedTime;
}

-(void)resumeAnimations;
{
    CALayer *layer = self.layer;

    for (NSString *key in self.animations) {
        [layer addAnimation:self.animations[key] forKey:key];
    }

    CFTimeInterval pausedTime = [layer timeOffset];
    layer.speed = 1.0;
    layer.timeOffset = 0.0;
    layer.beginTime = 0.0;
    CFTimeInterval timeSincePause = [layer convertTime:CACurrentMediaTime() fromLayer:nil] - pausedTime;
    layer.beginTime = timeSincePause;
}

@end

