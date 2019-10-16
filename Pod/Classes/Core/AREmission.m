#import "AREmission.h"
#import "AREventsModule.h"
#import "ARSwitchBoardModule.h"
#import "ARTemporaryAPIModule.h"
#import "ARRefineOptionsModule.h"
#import "ARWorksForYouModule.h"
#import "ARTakeCameraPhotoModule.h"
#import "ARNotificationsManager.h"
#import "ARCocoaConstantsModule.h"
#import "ARGraphQLQueryPreloader.h"
#import "ARGraphQLQueryCache.h"

#import <SentryReactNative/RNSentry.h>

NSString *const AREnvProduction = @"production";
NSString *const AREnvStaging = @"staging";
NSString *const AREnvTest = @"test";

void AREnvAssert(NSString *env) {
  if ([env isEqualToString:AREnvProduction] || [env isEqualToString:AREnvStaging] || [env isEqualToString:AREnvTest]) {
    return;
  }
  [NSException raise:NSInvalidArgumentException format:@"Invalid AREnv '%@'", env];
}

@implementation AREmissionConfiguration

RCT_EXPORT_MODULE(Emission);

+ (BOOL)requiresMainQueueSetup;
{
    return NO;
}

- (NSDictionary *)constantsToExport
{
  return @{
    @"userID": self.userID,
    @"authenticationToken": self.authenticationToken,

    @"gravityURL": self.gravityURL,
    @"metaphysicsURL": self.metaphysicsURL,
    @"predictionURL": self.predictionURL,
    @"userAgent": self.userAgent,
    @"options": self.options,
    // production | staging | test
    @"env": self.env,

    // Empty is falsy in JS, so these are fine too.
    @"googleMapsAPIKey": self.googleMapsAPIKey ?: @"",
    @"sentryDSN": self.sentryDSN ?: @"",
    @"stripePublishableKey": self.stripePublishableKey ?: @"",
    @"mapBoxAPIClientKey": self.mapBoxAPIClientKey ?: @"",
  };
}

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)token
                     sentryDSN:(nullable NSString *)sentryDSN
          stripePublishableKey:(nullable NSString *)stripePublishableKey
              googleMapsAPIKey:(nullable NSString *)googleAPIKey
            mapBoxAPIClientKey:(nullable NSString *)mapBoxAPIClientKey
                    gravityURL:(NSString *)gravity
                metaphysicsURL:(NSString *)metaphysics
                 predictionURL:(NSString *)prediction
                     userAgent:(NSString *)userAgent
                           env:(NSString *)env
                       options:(NSDictionary *)options
{
    self = [super init];
    _userID = userID.copy;
    _authenticationToken = token.copy;
    _sentryDSN = sentryDSN.copy;
    _stripePublishableKey = stripePublishableKey.copy;
    _googleMapsAPIKey = googleAPIKey.copy;
    _gravityURL = gravity.copy;
    _mapBoxAPIClientKey = mapBoxAPIClientKey.copy;
    _metaphysicsURL = metaphysics.copy;
    _predictionURL = prediction.copy;
    _userAgent = userAgent.copy;
    _options = options.copy;
    _env = env;
    return self;
}
@end



@implementation AREmission

static AREmission *_sharedInstance = nil;

+ (void)setSharedInstance:(AREmission *)instance;
{
  _sharedInstance = instance;
}

+ (instancetype)sharedInstance;
{
  NSParameterAssert(_sharedInstance);
  return _sharedInstance;
}

- (instancetype)initWithConfiguration:(AREmissionConfiguration *)config packagerURL:(nullable NSURL *)packagerURL
{
  NSParameterAssert(config);
  NSParameterAssert(config.userID);
  NSParameterAssert(config.authenticationToken);
  NSParameterAssert(config.gravityURL);
  NSParameterAssert(config.metaphysicsURL);
  NSParameterAssert(config.predictionURL);
  NSParameterAssert(config.options);

  if ((self = [super init])) {
    // When adding a new native module, remember to add it
    // to the array of modules below.
    _eventsModule = [AREventsModule new];
    _switchBoardModule = [ARSwitchBoardModule new];
    _APIModule = [ARTemporaryAPIModule new];
    _refineModule = [ARRefineOptionsModule new];
    _worksForYouModule = [ARWorksForYouModule new];
    _cameraModule = [ARTakeCameraPhotoModule new];
    _notificationsManagerModule = [ARNotificationsManager new];
    _graphQLQueryCacheModule = [ARGraphQLQueryCache new];
    _graphQLQueryPreloaderModule = [[ARGraphQLQueryPreloader alloc] initWithConfiguration:config
                                                                                    cache:_graphQLQueryCacheModule];

    _configurationModule = config;

    NSArray *modules = @[
        _APIModule,
        _configurationModule,
        _eventsModule,
        _switchBoardModule,
        _refineModule,
        _worksForYouModule,
        _cameraModule,
        _notificationsManagerModule,
        _graphQLQueryPreloaderModule,
        _graphQLQueryCacheModule,
        [ARCocoaConstantsModule new],
    ];

    _bridge = [[RCTBridge alloc] initWithBundleURL:(packagerURL ?: self.releaseBundleURL)
                                    moduleProvider:^{ return modules; }
                                     launchOptions:nil];

    if (config.sentryDSN) {
      [RNSentry installWithBridge:_bridge];
    }
  }
  return self;
}

- (NSURL *)releaseBundleURL;
{
  return [[NSBundle bundleForClass:self.class] URLForResource:@"Emission" withExtension:@"js"];
}

@end
