#import "ARNotificationsManager.h"
#import <React/RCTBridgeModule.h>

// This class is being used as a generic bridge between obj-c and TS for state and events.
// As we refactor more of the app infrastructure to live in TS  we should use this class
// to serve as a minimal-api-surface-area layer of glue that is easy to see the scope of at a glance.
// Once this class encompasses as much of the strictly-necessary bridging code as possible we can duplicate it in Java
// for the android build.


@implementation ARStateKey
// These should match the values in src/lib/store/NativeModel.ts
+ (NSString *)selectedTab { return @"selectedTab"; }
+ (NSString *)userID { return @"userID"; }
+ (NSString *)authenticationToken { return @"authenticationToken"; }
+ (NSString *)launchCount { return @"launchCount"; }
+ (NSString *)onboardingState { return @"onboardingState"; }

+ (NSString *)gravityURL { return @"gravityURL"; }
+ (NSString *)metaphysicsURL { return @"metaphysicsURL"; }
+ (NSString *)predictionURL { return @"predictionURL"; }
+ (NSString *)webURL { return @"webURL"; }
+ (NSString *)userAgent { return @"userAgent"; }
+ (NSString *)options { return @"options"; }

+ (NSString *)legacyFairSlugs { return @"legacyFairSlugs"; }
+ (NSString *)legacyFairProfileSlugs { return @"legacyFairProfileSlugs"; }

+ (NSString *)env { return @"env"; }
+ (NSString *)deviceId { return @"deviceId"; }

+ (NSString *)stripePublishableKey { return @"stripePublishableKey"; }
+ (NSString *)sentryDSN { return @"sentryDSN"; };
@end


@interface ARNotificationsManager ()
@property (nonatomic, assign, readwrite) BOOL isBeingObserved;
@property (strong, nonatomic, readwrite) NSDictionary *state;

@property (readwrite, nonatomic, strong) NSMutableArray<void (^)()> *bootstrapQueue;
@property (readwrite, nonatomic, assign) BOOL didBootStrap;
@end

// event keys
// These should match the values in src/lib/store/NativeModel.ts
static const NSString *notificationReceived = @"NOTIFICATION_RECEIVED";
static const NSString *stateChanged = @"STATE_CHANGED";
static const NSString *resetState = @"RESET_APP_STATE";
static const NSString *requestNavigation = @"REQUEST_NAVIGATION";


@implementation ARNotificationsManager

RCT_EXPORT_MODULE();

- (instancetype)initWithState:(NSDictionary *)state
{
    self = [super init];
    if (self) {
        _state = [state copy];
        _bootstrapQueue = [[NSMutableArray alloc] init];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup;
{
    return NO;
}

- (NSDictionary *)state
{
    return _state;
}

- (NSDictionary *)constantsToExport
{
    return @{ @"nativeState" : self.state };
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[ @"event" ];
}

- (void)dispatch:(NSString *)eventName data:(NSDictionary *)data
{
    __weak ARNotificationsManager *wself = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        __strong ARNotificationsManager *sself = wself;
        if (!sself) return;
        if (sself.isBeingObserved) {
            [sself sendEventWithName:@"event" body:@{@"type": eventName, @"payload": data ? data : [NSNull null]}];
        }
    });
}

- (void)updateState:(NSDictionary *)state
{
    @synchronized(self)
    {
        NSMutableDictionary *nextState = [[self state] mutableCopy];
        [nextState addEntriesFromDictionary:state];
        _state = [[NSDictionary alloc] initWithDictionary:nextState];
        [self dispatch:stateChanged data:_state];
    }
}

- (void)notificationReceived
{
    [self dispatch:notificationReceived data:@{}];
}

- (void)reset
{
    [self dispatch:resetState data:self.state];
}

- (void)requestNavigation:(NSString *)route
{
    __weak typeof(self) wself = self;
    [self afterBootstrap:^{
        __strong typeof(self) sself = wself;
        if (!sself) return;
        [sself dispatch:requestNavigation data:@{@"route": route}];
    }];
}

// Will be called when this module's first listener is added.
- (void)startObserving
{
    self.isBeingObserved = true;
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving
{
    self.isBeingObserved = false;
}

- (void)afterBootstrap:(void (^)())completion
{
    if (self.didBootStrap) {
        completion();
    } else {
        [self.bootstrapQueue addObject:completion];
    }
}

RCT_EXPORT_METHOD(postNotificationName
                  : (nonnull NSString *)notificationName userInfo
                  : (NSDictionary *)userInfo)
{
    [[NSNotificationCenter defaultCenter] postNotificationName:notificationName object:nil userInfo:userInfo];
}

RCT_EXPORT_METHOD(didFinishBootstrapping)
{
    self.didBootStrap = true;
    while (self.bootstrapQueue.count > 0) {
        void (^completion)() = [self.bootstrapQueue firstObject];
        [self.bootstrapQueue removeObjectAtIndex:0];
        completion();
    }
}

// All notification JS methods occur on the main queue/thread.
- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}


@end
