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


@import Darwin.POSIX.sys.utsname;

NSString *const AREnvProduction = @"production";
NSString *const AREnvStaging = @"staging";
NSString *const AREnvTest = @"test";
NSString *const AREmissionEventFeaturesDidChange = @"featuresDidChange";


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

/*

deviceId taken from https://github.com/react-native-community/react-native-device-info/blob/d08f7f6db0407de5dc5252ebf2aa2ec58bd78dfc/ios/RNDeviceInfo/RNDeviceInfo.m

The MIT License (MIT)

Copyright (c) 2015 Rebecca Hughes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
- (NSString *)deviceId;
{
  struct utsname systemInfo;
  uname(&systemInfo);
  NSString* deviceId = [NSString stringWithCString:systemInfo.machine
                                          encoding:NSUTF8StringEncoding];
  if ([deviceId isEqualToString:@"i386"] || [deviceId isEqualToString:@"x86_64"] ) {
    deviceId = [NSString stringWithFormat:@"%s", getenv("SIMULATOR_MODEL_IDENTIFIER")];
  }
  return deviceId;
}


- (NSDictionary *)constantsToExport
{
  return @{
    @"userID": self.userID,
    @"authenticationToken": self.authenticationToken,
    @"launchCount": @(self.launchCount),

    @"gravityURL": self.gravityURL,
    @"metaphysicsURL": self.metaphysicsURL,
    @"predictionURL": self.predictionURL,
    @"userAgent": self.userAgent,
    @"options": self.options,
    // production | staging | test
    @"env": self.env,
    @"deviceId": self.deviceId,

    // Empty is falsy in JS, so these are fine too.
    @"googleMapsAPIKey": self.googleMapsAPIKey ?: @"",
    @"sentryDSN": self.sentryDSN ?: @"",
    @"stripePublishableKey": self.stripePublishableKey ?: @"",
    @"mapBoxAPIClientKey": self.mapBoxAPIClientKey ?: @"",
  };
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[
        AREmissionEventFeaturesDidChange,
    ];
}

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)token
                   launchCount:(NSInteger)launchCount
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
    _launchCount = launchCount;
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

- (void)updateJSCode:(NSDictionary *)featureMap
{
    _options = featureMap;
    [self sendEventWithName:AREmissionEventFeaturesDidChange
                       body:_options];
}

RCT_EXPORT_METHOD(getFreshOptions:(RCTResponseSenderBlock)block)
{
    block(@[[NSNull null], _options]);
}

@end



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
    _cameraModule = [ARTakeCameraPhotoModule new];
    _notificationsManagerModule = [[ARNotificationsManager alloc] init];
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

- (NSURL *)releaseBundleURL;
{
  return [[NSBundle bundleForClass:self.class] URLForResource:@"Emission" withExtension:@"js"];
}

@end
