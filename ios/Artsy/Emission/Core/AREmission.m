#import "AREmission.h"
#import "AREventsModule.h"
#import "ARTemporaryAPIModule.h"
#import "ARTakeCameraPhotoModule.h"
#import "ARPHPhotoPickerModule.h"
#import "ARNotificationsManager.h"
#import "ARCocoaConstantsModule.h"


@implementation AREmission

static AREmission *_sharedInstance = nil;

+ (void)setSharedInstance:(AREmission *)instance;
{
  _sharedInstance = instance;
}

+ (void)teardownSharedInstance {
    [_sharedInstance.bridge invalidate];
    _sharedInstance = nil;
}

+ (instancetype)sharedInstance;
{
  NSParameterAssert(_sharedInstance);
  return _sharedInstance;
}

- (instancetype)initWithState:(NSDictionary *)state packagerURL:(nullable NSURL *)packagerURL
{
  NSParameterAssert(state);

  if ((self = [super init])) {
    // When adding a new native module, remember to add it
    // to the array of modules below.
    _eventsModule = [AREventsModule new];
    _APIModule = [ARTemporaryAPIModule new];
    _cameraModule = [ARTakeCameraPhotoModule new];
    _phPhotoPickerModule = [ARPHPhotoPickerModule new];
    _notificationsManagerModule = [[ARNotificationsManager alloc] initWithState:state];

    NSArray *modules = @[
        _APIModule,
        _eventsModule,
        _cameraModule,
        _phPhotoPickerModule,
        _notificationsManagerModule,
        [ARCocoaConstantsModule new],
    ];

    _bridge = [[RCTBridge alloc] initWithBundleURL:(packagerURL ?: self.releaseBundleURL)
                                    moduleProvider:^{ return modules; }
                                     launchOptions:nil];
  }
  return self;
}

- (void)reset
{
    [self updateState:@{
        [ARStateKey authenticationToken]: [NSNull null],
        [ARStateKey userID]: [NSNull null],
        [ARStateKey userEmail]: [NSNull null],
    }];
}

- (void)navigate:(NSString *)route
{
    [[self notificationsManagerModule] requestNavigation:route];
}

- (void)navigate:(NSString *)route withProps:(NSDictionary *)props
{
    [[self notificationsManagerModule] requestNavigation:route withProps:props];
}

- (void)updateState:(NSDictionary *)state
{
    [self.notificationsManagerModule updateState:state];
}

- (void)sendEvent:(NSString *)name traits:(NSDictionary *)traits
{
    NSMutableDictionary *eventTraits = [traits mutableCopy];
    [eventTraits addEntriesFromDictionary:@{@"event_name": name }];
    [self.notificationsManagerModule sendEvent:eventTraits];
}

- (void)sendScreenEvent:(NSString *)screenName traits:(NSDictionary *)traits
{
    NSMutableDictionary *screenTraits = [traits mutableCopy];
    [screenTraits addEntriesFromDictionary:@{@"screen_name": screenName }];
    [self.notificationsManagerModule sendEvent:screenTraits];
}

- (void)sendIdentifyEvent:(NSDictionary *)traits
{
    [self.notificationsManagerModule sendIdentifyEvent:traits];
}

- (NSString *)stateStringForKey:(NSString *)stateKey
{
    NSString *result = [self.notificationsManagerModule.state valueForKey:stateKey];
    if (result != nil && ![result isKindOfClass:NSString.class]) {
        [NSException raise:NSInternalInconsistencyException format:@"Value for key '%@' is not a string.", stateKey];
    }
    return result;
}

- (NSString *)reactStateStringForKey:(NSString *)stateKey
{
    NSString *result = [self.notificationsManagerModule.reactState valueForKey:stateKey];
    if (result && ![result isKindOfClass:NSString.class]) {
        [NSException raise:NSInternalInconsistencyException format:@"Value for key '%@' is not a string.", stateKey];
    }
    return result;
}

- (BOOL)reactStateBoolForKey:(NSString *)stateKey
{
    NSNumber *result = [self.notificationsManagerModule.reactState valueForKey:stateKey];
    if (result != nil && ![result isKindOfClass:NSNumber.class]) {
        [NSException raise:NSInternalInconsistencyException format:@"Value for key '%@' is not a boolean.", stateKey];
    }
    return [result boolValue];
}

- (NSURL *)releaseBundleURL;
{
  return [[NSBundle bundleForClass:self.class] URLForResource:@"Emission" withExtension:@"js"];
}

- (NSURL *)liveAuctionsURL
{
    return [NSURL URLWithString:[self reactStateStringForKey:[ARReactStateKey predictionURL]]];
}

- (BOOL)isStaging
{
    return [[self reactStateStringForKey:[ARReactStateKey env]] isEqualToString:@"staging"];
}

@end
