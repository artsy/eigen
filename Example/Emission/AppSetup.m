#import <KSCrash/KSCrash.h>

#import "ARDefaults.h"
#import "AppSetup.h"
#import "PRNetworkModel.h"
#import "CommitNetworkModel.h"
#import <Emission/AREmission.h>
#import "ARLabOptions.h"

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
    _predictionURL = @"https://live.artsy.net";
    _volleyURL = @"https://volley.artsy.net/report";

    BOOL useStaging = [defaults boolForKey:ARUseStagingDefault];
    if (useStaging) {
      _gravityURL = [defaults stringForKey:ARStagingAPIURLDefault];
      _metaphysicsURL = [defaults stringForKey:ARStagingMetaphysicsURLDefault];
      _predictionURL = [defaults stringForKey:ARStagingPredictionURLDefault];
      _volleyURL = [defaults stringForKey:ARStagingVolleyURLDefault];
    }

    BOOL runningUnitTests = NSClassFromString(@"XCTest") != Nil;
    BOOL runningCITests = NO;
    BOOL useMaster = ![[KSCrash sharedInstance] crashedLastLaunch];
    BOOL usePRBuild = NO;
    BOOL useRNP = NO;
    BOOL isSimulator = NO;

#ifdef RUNNING_ON_CI
    runningCITests = YES;
#endif

#if TARGET_IPHONE_SIMULATOR
    isSimulator = !runningCITests; // Don't use RNP with unit tests
#endif

    // Comment these out to set yourself up as though you were running the beta
    usePRBuild = [defaults boolForKey:ARUsePREmissionDefault];
    useMaster = useMaster || isSimulator;
    useRNP = isSimulator || [defaults boolForKey:ARForceUseRNPDefault];

    if (runningUnitTests) {
      if (runningCITests) {
        // nop on CI, we'll fall back to the bundled Emission JS which we've just built with `yarn bundle:native-tests`
        NSLog(@"ASH I AM HERE");
      } else {
        NSString *rnpString = [NSString stringWithFormat:@"http://%@:8081/Example/Emission/index.tests.ios.bundle?platform=ios&dev=true", packagerURL];

        _jsCodeLocation = [NSURL URLWithString:rnpString];
        _emissionLoadedFromString = [NSString stringWithFormat:@"Using Unit Test RNP from %@", _jsCodeLocation.host];
      }
    } else {
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
    }

    // Fall back to the bundled Emission JS for release
    if (!_jsCodeLocation) {
      NSBundle *emissionBundle = [NSBundle bundleForClass:AREmission.class];

      _jsCodeLocation = [emissionBundle URLForResource:@"Emission" withExtension:@"js"];
      _emissionLoadedFromString = @"Using bundled JS";
      NSLog(@"%@", _emissionLoadedFromString);
    }

    _inSimulator = isSimulator;
    _inStaging = useStaging;

    _usingMaster = useMaster;
    _usingRNP = useRNP;
    _usingPRBuild = usePRBuild;

    _options = [ARLabOptions labOptionsMap];
  }

  return self;
}

@end
