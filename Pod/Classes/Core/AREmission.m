#import "AREmission.h"
#import "AREventsModule.h"
#import "ARSwitchBoardModule.h"
#import "ARTemporaryAPIModule.h"

#import <React/RCTBridge.h>

@implementation AREmission

static AREmission *_sharedInstance = nil;

+ (void)setSharedInstance:(AREmission *)instance;
{
  _sharedInstance = instance;
}

+ (instancetype)sharedInstance;
{
  if (_sharedInstance == nil) {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      _sharedInstance = [self new];
    });
  }
  return _sharedInstance;
}

- (instancetype)init;
{
  return [self initWithPackagerURL:nil];
}

- (instancetype)initWithPackagerURL:(NSURL *)packagerURL;
{
  if ((self = [super init])) {
    _eventsModule = [AREventsModule new];
    _switchBoardModule = [ARSwitchBoardModule new];
    _APIModule = [ARTemporaryAPIModule new];
    
    _bridge = [[RCTBridge alloc] initWithBundleURL:(packagerURL ?: self.releaseBundleURL)
                                    moduleProvider:^{ return @[_eventsModule, _switchBoardModule, _APIModule]; }
                                     launchOptions:nil];
  }
  return self;
}

- (NSURL *)releaseBundleURL;
{
  return [[NSBundle bundleForClass:self.class] URLForResource:@"Emission" withExtension:@"jsbundle"];
}

@end
