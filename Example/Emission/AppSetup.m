#import <KSCrash/KSCrash.h>

#import "ARDefaults.h"
#import "AppSetup.h"
#import "PRNetworkModel.h"
#import "CommitNetworkModel.h"
#import <Emission/AREmission.h>

@implementation AppSetup

+ (instancetype)ambientSetup
{
  return [[self.class alloc] initWithAmbientContext];
}

- (instancetype)initWithAmbientContext
{
  self = [super init];
  if (self) {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];

    NSString *packagerURL = [defaults stringForKey:ARRNPackagerHostDefault];;
    _gravityURL = @"https://api.artsy.net";
    _metaphysicsURL = @"https://metaphysics-production.artsy.net";

    BOOL useStaging = [defaults boolForKey:ARUseStagingDefault];
    if (useStaging) {
      _gravityURL = [defaults stringForKey:ARStagingAPIURLDefault];
      _metaphysicsURL = [defaults stringForKey:ARStagingMetaphysicsURLDefault];
    }

    BOOL useMaster = ![[KSCrash sharedInstance] crashedLastLaunch];
    BOOL usePRBuild = [defaults boolForKey:ARUsePREmissionDefault];
    BOOL useRNP = NO;
    BOOL isSimulator = NO;

#if TARGET_IPHONE_SIMULATOR
    isSimulator = YES;
#endif

#if DEBUG
    useMaster = NO;
#endif

    useRNP = isSimulator || [defaults boolForKey:ARForceUseRNPDefault];

    if (usePRBuild) {
      PRNetworkModel *pr = [PRNetworkModel new];
      _jsCodeLocation = [pr fileURLForPRJavaScript];

      NSInteger prNumber = [defaults integerForKey:ARPREmissionIDDefault];
      _emissionLoadedFromString = [NSString stringWithFormat:@"PR #%@", @(prNumber)];

    } else if (useRNP) {
        NSString *rnpString = [NSString stringWithFormat:@"http://%@:8081/Example/Emission/index.ios.bundle?platform=ios&dev=true", packagerURL];

        _jsCodeLocation = [NSURL URLWithString:rnpString];
        _emissionLoadedFromString = [NSString stringWithFormat:@"Using RNP from %@", _jsCodeLocation.host];

    } else if (useMaster) {
      CommitNetworkModel *master = [CommitNetworkModel new];
      _jsCodeLocation = [master fileURLForLatestCommitJavaScript];

      _emissionLoadedFromString = @"Using latest JS from master";
    }

    // Fall back to the bundled Emission JS for release
    if (!_jsCodeLocation) {
      NSBundle *emissionBundle = [NSBundle bundleForClass:AREmission.class];

      _jsCodeLocation = [emissionBundle URLForResource:@"Emission" withExtension:@"js"];
      _emissionLoadedFromString = @"Using bundled JS";
    }

    _inSimulator = isSimulator;
    _inStaging = useStaging;

    _usingMaster = useMaster;
    _usingRNP = useRNP;
    _usingPRBuild = usePRBuild;
  }

  return self;
}

@end
