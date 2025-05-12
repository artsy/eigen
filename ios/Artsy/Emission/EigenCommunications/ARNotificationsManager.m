#import "ARNotificationsManager.h"
#import "AppDelegate.h"
#import "AppDelegate+DeeplinkTimeout.h"

// This class is being used as a generic bridge between obj-c and TS for state and events.
// As we refactor more of the app infrastructure to live in TS  we should use this class
// to serve as a minimal-api-surface-area layer of glue that is easy to see the scope of at a glance.
// Once this class encompasses as much of the strictly-necessary bridging code as possible we can duplicate it in Java
// for the android build.


@implementation ARStateKey
// These should match the values in src/app/store/NativeModel.ts
+ (NSString *)userID { return @"userID"; }
+ (NSString *)authenticationToken { return @"authenticationToken"; }
+ (NSString *)launchCount { return @"launchCount"; }
+ (NSString *)userEmail { return @"userEmail"; }
+ (NSString *)userAgent { return @"userAgent"; }
+ (NSString *)env { return @"env"; }
@end

@implementation ARReactStateKey
+ (NSString *)gravityURL { return @"gravityURL"; };
+ (NSString *)metaphysicsURL { return @"metaphysicsURL"; };
+ (NSString *)predictionURL { return @"predictionURL"; };
+ (NSString *)webURL { return @"webURL"; };
+ (NSString *)causalityURL { return @"causalityURL"; };
+ (NSString *)env { return @"env"; };
+ (NSString *)userIsDev { return @"userIsDev"; }
@end

// event keys
// These should match the values in src/app/store/NativeModel.ts
static NSString *notificationReceived = @"NOTIFICATION_RECEIVED";
static NSString *modalDismissed = @"MODAL_DISMISSED";
static NSString *stateChanged = @"STATE_CHANGED";
static NSString *reactStateChanged = @"STATE_CHANGED";
static NSString *requestNavigation = @"REQUEST_NAVIGATION";
static NSString *requestModalDismiss = @"REQUEST_MODAL_DISMISS";
static NSString *eventTracking = @"EVENT_TRACKING";
static NSString *identifyTracking = @"IDENTIFY_TRACKING";

// Singleton instance
static ARNotificationsManager *_sharedInstance = nil;

@interface ARNotificationsManager ()

@property (nonatomic, assign, readwrite) BOOL isBeingObserved;
@property (strong, nonatomic, readwrite) NSDictionary *state;
@property (strong, nonatomic, readwrite) NSMutableDictionary *reactState;
@property (readwrite, nonatomic, strong) NSMutableArray<void (^)(void)> *bootstrapQueue;
@property (readwrite, nonatomic, assign) BOOL didBootStrap;

@end

@implementation ARNotificationsManager

RCT_EXPORT_MODULE();

#pragma mark - Singleton Management


+ (instancetype)sharedInstance {
    return _sharedInstance;
}

- (instancetype)initWithState:(NSDictionary *)state {
    ARNotificationsManager *instance = _sharedInstance;

    if (!instance) {
        instance = [super init];
        _sharedInstance = instance;

        instance->_bootstrapQueue = [[NSMutableArray alloc] init];
        instance->_reactState = [[NSMutableDictionary alloc] init];
    }

    // Apply the state regardless of whether it was already initialized
    if (state) {
        instance->_state = [state copy];
    }

    return instance;
}

- (instancetype)init {
    if (_sharedInstance) {
        return _sharedInstance;
    }

    self = [super init];
    if (self) {
        _sharedInstance = self;

        // Default initialization in case RN got here first
        _state = @{};
        _bootstrapQueue = [[NSMutableArray alloc] init];
        _reactState = [[NSMutableDictionary alloc] init];
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
    return self.state;
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

- (void)dispatchAfterBootstrap:(NSString *)eventName data:(NSDictionary *)data
{
    __weak typeof(self) wself = self;
    [self afterBootstrap:^{
        __strong typeof(self) sself = wself;
        if (!sself) return;
        [sself dispatch:eventName data:data];
    }];
}

- (void)updateState:(NSDictionary *)state
{
    @synchronized(self)
    {
        NSMutableDictionary *nextState = [[self state] mutableCopy];
        [nextState addEntriesFromDictionary:state];
        _state = [[NSDictionary alloc] initWithDictionary:nextState];
        [self dispatchAfterBootstrap:stateChanged data:_state];
    }
}

- (void)sendEvent:(NSDictionary *)traits
{
    @synchronized(self)
    {
        [self dispatchAfterBootstrap:eventTracking data:traits];
    }
}

- (void)sendIdentifyEvent:(NSDictionary *)traits
{
    @synchronized(self)
    {
        [self dispatchAfterBootstrap:identifyTracking data:traits];
    }
}

- (void)notificationReceived
{
    [self dispatchAfterBootstrap:notificationReceived data:@{}];
}

- (void)modalDismissed
{
    [self dispatchAfterBootstrap:modalDismissed data:@{}];
}

- (void)requestNavigation:(NSString *)route
{
    [self requestNavigation:route withProps: @{}];
}

- (void)requestNavigation:(NSString *)route withProps:(NSDictionary *)props
{
    if (!route) return;
    [[ARAppDelegate sharedInstance] startDeeplinkTimeoutWithRoute:route];
    [self dispatchAfterBootstrap:requestNavigation data:@{@"route": route, @"props": props}];
}

- (void)requestModalDismiss
{
    [self dispatchAfterBootstrap:requestModalDismiss data:@{}];
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

- (void)afterBootstrap:(void (^)(void))completion
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
        void (^completion)(void) = [self.bootstrapQueue firstObject];
        [self.bootstrapQueue removeObjectAtIndex:0];
        completion();
    }
}

- (void)updateReactState:(nonnull NSDictionary *)reactState
{
    @synchronized (self) {
        [_reactState addEntriesFromDictionary:reactState];
    }
}

RCT_EXPORT_METHOD(reactStateUpdated:(nonnull NSDictionary *)reactState)
{
    [self updateReactState:reactState];
}

// All notification JS methods occur on the main queue/thread.
- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

@end
