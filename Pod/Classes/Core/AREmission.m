#import "AREmission.h"
#import "AREventsModule.h"
#import "ARSwitchBoardModule.h"
#import "ARTemporaryAPIModule.h"
#import "ARRefineOptionsModule.h"
#import "ARWorksForYouModule.h"

#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <SentryReactNative/RNSentry.h>


@interface AREmissionConfiguration : NSObject <RCTBridgeModule>
@property (nonatomic, strong, readwrite) NSString *userID;
@property (nonatomic, strong, readwrite) NSString *authenticationToken;
@property (nonatomic, strong, readwrite) NSString *sentryDSN;
@property (nonatomic, assign, readwrite) BOOL useStagingEnvironment;
@end

@implementation AREmissionConfiguration

RCT_EXPORT_MODULE(Emission);

- (NSDictionary *)constantsToExport
{
  return @{
    @"userID": self.userID,
    @"authenticationToken": self.authenticationToken,
    @"useStagingEnvironment": @(self.useStagingEnvironment),
    @"sentryDSN": self.sentryDSN ?: @"", // Empty is falsy in JS, so this is fine too.
  };
}

@end


@interface AREmission ()
@property (nonatomic, strong, readwrite) AREmissionConfiguration *configurationModule;
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

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)authenticationToken;
{
  return [self initWithUserID:userID
          authenticationToken:authenticationToken
                  packagerURL:nil
        useStagingEnvironment:NO];
}

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)authenticationToken
                   packagerURL:(nullable NSURL *)packagerURL
         useStagingEnvironment:(BOOL)useStagingEnvironment;
{
  return [self initWithUserID:userID
          authenticationToken:authenticationToken
                  packagerURL:packagerURL
        useStagingEnvironment:useStagingEnvironment
                    sentryDSN:nil];
}

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)authenticationToken
                   packagerURL:(nullable NSURL *)packagerURL
         useStagingEnvironment:(BOOL)useStagingEnvironment
                     sentryDSN:(nullable NSString *)sentryDSN;
{
  NSParameterAssert(userID);
  NSParameterAssert(authenticationToken);

  if ((self = [super init])) {
    _eventsModule = [AREventsModule new];
    _switchBoardModule = [ARSwitchBoardModule new];
    _APIModule = [ARTemporaryAPIModule new];
    _refineModule = [ARRefineOptionsModule new];
    _worksForYouModule = [ARWorksForYouModule new];

    _configurationModule = [AREmissionConfiguration new];
    _configurationModule.userID = userID;
    _configurationModule.authenticationToken = authenticationToken;
    _configurationModule.useStagingEnvironment = useStagingEnvironment;
    _configurationModule.sentryDSN = sentryDSN;

    NSArray *modules = @[_APIModule, _configurationModule, _eventsModule, _switchBoardModule, _refineModule, _worksForYouModule];

    _bridge = [[RCTBridge alloc] initWithBundleURL:(packagerURL ?: self.releaseBundleURL)
                                    moduleProvider:^{ return modules; }
                                     launchOptions:nil];
    
    if (sentryDSN) {
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
