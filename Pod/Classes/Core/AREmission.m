#import "AREmission.h"
#import "AREventsModule.h"
#import "ARSwitchBoardModule.h"
#import "ARTemporaryAPIModule.h"
#import "ARRefineOptionsModule.h"
#import "ARWorksForYouModule.h"
#import "ARTakeCameraPhotoModule.h"

#import <SentryReactNative/RNSentry.h>

@implementation AREmissionConfiguration

RCT_EXPORT_MODULE(Emission);

- (NSDictionary *)constantsToExport
{
  return @{
    @"userID": self.userID,
    @"authenticationToken": self.authenticationToken,

    @"gravityAPIHost": self.gravityAPIHost,
    @"metaphysicsAPIHost": self.metaphysicsAPIHost,

    // Empty is falsy in JS, so these are fine too.
    @"googleMapsAPIKey": self.googleMapsAPIKey ?: @"",
    @"sentryDSN": self.sentryDSN ?: @"",
  };
}

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)token
                     sentryDSN:(NSString *)sentryDSN
              googleMapsAPIKey:(NSString *)googleAPIKey
                   gravityHost:(NSString *)gravity
               metaphysicsHost:(NSString *)metaphysics
{
    self = [super init];
    _userID = userID.copy;
    _authenticationToken = token.copy;
    _sentryDSN = sentryDSN.copy;
    _googleMapsAPIKey = googleAPIKey.copy;
    _gravityAPIHost = gravity.copy;
    _metaphysicsAPIHost = metaphysics.copy;
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
  NSParameterAssert(config.gravityAPIHost);
  NSParameterAssert(config.metaphysicsAPIHost);

  if ((self = [super init])) {
    // When adding a new native module, remember to add it
    // to the array of modules below.
    _eventsModule = [AREventsModule new];
    _switchBoardModule = [ARSwitchBoardModule new];
    _APIModule = [ARTemporaryAPIModule new];
    _refineModule = [ARRefineOptionsModule new];
    _worksForYouModule = [ARWorksForYouModule new];
    _cameraModule = [ARTakeCameraPhotoModule new];

    _configurationModule = config;

    NSArray *modules = @[_APIModule, _configurationModule, _eventsModule, _switchBoardModule, _refineModule, _worksForYouModule, _cameraModule];

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
