#import "ARNotificationsManager.h"
#import <React/RCTBridgeModule.h>

// This class is being used as a generic bridge between obj-c and TS for state and events.
// As we refactor more of the app infrastructure to live in TS  we should use this class
// to serve as a minimal-api-surface-area layer of glue that is easy to see the scope of at a glance.
// Once this class encompasses as much of the strictly-necessary bridging code as possible we can duplicate it in Java
// for the android build.

@interface ARNotificationsManager ()
@property (nonatomic, assign, readwrite) BOOL isBeingObserved;
@property (strong, nonatomic, readwrite) NSDictionary *state;
@end

// state keys
// These should match the values in src/lib/store/NativeModel.ts
static const NSString *selectedTab = @"selectedTab";
static const NSString *emissionOptions = @"emissionOptions";

// event keys
// These should match the values in src/lib/store/NativeModel.ts
static const NSString *notificationReceived = @"NOTIFICATION_RECEIVED";
static const NSString *stateChanged = @"STATE_CHANGED";

@implementation ARNotificationsManager

RCT_EXPORT_MODULE();

- (instancetype)init
{
    self = [super init];
    if (self) {
        _state = @{};
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup;
{
    return NO;
}

- (NSDictionary *)constantsToExport
{
    return @{@"nativeState": self.state};
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"event"];
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
    @synchronized (self) {
        NSMutableDictionary *nextState = [[self state] mutableCopy];
        [nextState addEntriesFromDictionary:state];
        self.state = [[NSDictionary alloc] initWithDictionary:nextState];
        [self dispatch:stateChanged data:self.state];
    }
}

- (void)selectedTabChanged:(NSString *)nextTab
{
    [self updateState:@{selectedTab: nextTab}];
}

- (void)notificationReceived
{
    [self dispatch:notificationReceived data:@{}];
}

- (void)emissionOptionsChanged:(NSDictionary *)options
{
    [self updateState:@{emissionOptions: options}];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    self.isBeingObserved = true;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    self.isBeingObserved = false;
}

RCT_EXPORT_METHOD(postNotificationName:(nonnull NSString *)notificationName userInfo:(NSDictionary *)userInfo)
{
    [[NSNotificationCenter defaultCenter] postNotificationName:notificationName object:nil userInfo:userInfo];
}

// All notification JS methods occur on the main queue/thread.
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end
