#import "AREmission.h"
#import "AREventsModule.h"
#import "ARSwitchBoardModule.h"
#import "ARTemporaryAPIModule.h"
#import "ARRefineOptionsModule.h"
#import "ARTakeCameraPhotoModule.h"
#import "ARNotificationsManager.h"
#import "ARCocoaConstantsModule.h"
#import "ARGraphQLQueryPreloader.h"
#import "ARGraphQLQueryCache.h"


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
    _switchBoardModule = [ARSwitchBoardModule new];
    _APIModule = [ARTemporaryAPIModule new];
    _refineModule = [ARRefineOptionsModule new];
    _cameraModule = [ARTakeCameraPhotoModule new];
    _notificationsManagerModule = [[ARNotificationsManager alloc] initWithState: state];
    _graphQLQueryCacheModule = [ARGraphQLQueryCache new];
    _graphQLQueryPreloaderModule = [[ARGraphQLQueryPreloader alloc] initWithCache:_graphQLQueryCacheModule];

    NSArray *modules = @[
        _APIModule,
        _eventsModule,
        _switchBoardModule,
        _refineModule,
        _cameraModule,
        _notificationsManagerModule,
        _graphQLQueryPreloaderModule,
        _graphQLQueryCacheModule,
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
        [ARStateKey onboardingState]: @"none",
        [ARStateKey selectedTab]: @"home",
    }];
    [self.notificationsManagerModule reset];
}

- (void)updateState:(NSDictionary *)state
{
    [self.notificationsManagerModule updateState:state];
}

-(NSString *)stateStringForKey:(NSString *)stateKey
{
    NSString *result = [self.notificationsManagerModule.state valueForKey:stateKey];
    if (result && ![result isKindOfClass:NSString.class]) {
        [NSException raise:NSInternalInconsistencyException format:@"Value for key '%@' is not a string.", stateKey];
    }
    return result;
}

- (NSURL *)releaseBundleURL;
{
  return [[NSBundle bundleForClass:self.class] URLForResource:@"Emission" withExtension:@"js"];
}

@end
