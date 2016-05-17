#import "AREmission.h"
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
    _APIModule = [ARTemporaryAPIModule new];
    
    _bridge = [[RCTBridge alloc] initWithBundleURL:(packagerURL ?: self.releaseBundleURL)
                                    moduleProvider:^{ return @[_APIModule]; }
                                     launchOptions:nil];
    NSLog(@"BRIDGE URL: %@", _bridge.bundleURL);
  }
  return self;
}

- (NSURL *)releaseBundleURL;
{
  return [[NSBundle bundleForClass:self.class] URLForResource:@"Emission" withExtension:@"jsbundle"];
}

@end
