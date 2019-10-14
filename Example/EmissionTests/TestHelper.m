#import "TestHelper.h"
#import "AppSetup.h"
#import "AREmission.h"
#import "ARDefaults.h"

#import <SDWebImage/SDImageCache.h>
#import <SDWebImage/SDWebImageManager.h>

#import <React/RCTRootView.h>


@interface TestHelper ()
@property (nonatomic, strong, readwrite) NSArray<NSDictionary *> *artworksPages;
@property (nonatomic, strong, readwrite) NSArray<NSDictionary *> *artworks;
@end

@implementation TestHelper

@synthesize reactTestRunner = _reactTestRunner;

+ (instancetype)sharedHelper;
{
  return (TestHelper *)UIApplication.sharedApplication.delegate;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
  [self assertCorrectEnvironment];
  [self loadArtworksFixtures];

  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.rootViewController = [UIViewController new];
  self.window.rootViewController.view.backgroundColor = [UIColor redColor];
  [self.window makeKeyAndVisible];

  return YES;
}

- (void)assertCorrectEnvironment;
{
  NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;

  NSAssert(version.majorVersion == 10,
           @"The tests should be run on iOS 10.x, not %ld.%ld", version.majorVersion, version.minorVersion);

  CGSize nativeResolution = [UIScreen mainScreen].nativeBounds.size;
  NSAssert([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone && CGSizeEqualToSize(nativeResolution, CGSizeMake(750, 1334)),
           @"The tests should be run on an iPhone 6, not a device with native resolution %@",
           NSStringFromCGSize(nativeResolution));
}

- (void)loadArtworksFixtures;
{
  self.artworksPages = @[
    [self loadJSONFixture:@"rembrandt-harmensz-van-rijn-1_page-1"],
    [self loadJSONFixture:@"rembrandt-harmensz-van-rijn-1_page-2"],
  ];

  NSMutableArray *artworks = [NSMutableArray new];
  for (NSDictionary *artworksPage in self.artworksPages) {
    [artworks addObjectsFromArray:[artworksPage valueForKeyPath:@"data.artist.artworks"]];
  }
  self.artworks = [artworks copy];

  // Ensure the tests do not hit the network for images.
  SDImageCache *cache = [[SDImageCache alloc] initWithNamespace:@"test-fixtures" diskCacheDirectory:self.fixturesURL.path];
  [SDWebImageManager.sharedManager setValue:cache forKey:@"_imageCache"];

  for (NSDictionary *artwork in self.artworks) {
    NSURL *URL = [NSURL URLWithString:[artwork valueForKeyPath:@"image.resized.url"]];
    NSAssert([SDWebImageManager.sharedManager cachedImageExistsForURL:URL], @"Expected image to be available in cache: `%@'", URL);
  }
}

- (NSDictionary *)loadJSONFixture:(NSString *)filename;
{
  NSURL *URL = [[self.fixturesURL URLByAppendingPathComponent:filename] URLByAppendingPathExtension:@"json"];
  return [NSJSONSerialization JSONObjectWithData:[NSData dataWithContentsOfURL:URL]
                                         options:0
                                           error:nil];
}

- (NSURL *)fixturesURL;
{
  NSURL *testsDir = [[NSURL fileURLWithPath:@(__FILE__)] URLByDeletingLastPathComponent];
  return [testsDir URLByAppendingPathComponent:@"Fixtures"];
}

- (RCTTestRunner *)reactTestRunner;
{
  if (_reactTestRunner == nil) {
    [ARDefaults setup];
    AppSetup *setup = [AppSetup ambientSetup];

    NSURL *URL = TestHelper.sharedHelper.fixturesURL;
    URL = [URL URLByAppendingPathComponent:@"ReferenceImages"];
    _reactTestRunner = RCTInitRunnerForApp(@"EmissionTests/TestApps", ^NSArray<id<RCTBridgeModule>> *{
      // RCTTestRunner expects a new config for each run instead of storing one between runs.
      AREmissionConfiguration *config = [[AREmissionConfiguration alloc] initWithUserID:@"userID"
                                                                    authenticationToken:@"some.access.token"
                                                                              sentryDSN:nil
                                                                   stripePublishableKey:@"strip-test-key"
                                                                       googleMapsAPIKey:nil
                                                                     mapBoxAPIClientKey:@"mapbox-test-key"
                                                                             gravityURL:setup.gravityURL
                                                                         metaphysicsURL:setup.metaphysicsURL
                                                                          predictionURL:setup.predictionURL
                                                                              userAgent:@"Emission Example"
                                                                                    env:AREnvTest
                                                                                options:setup.options];
      return @[config];
    }, setup.jsCodeLocation);
  }
  return _reactTestRunner;
}

// Taken from Expecta+FBSnapshotTestCase
static SEL
currentTestName(void)
{
  id compiledExample = [[NSThread currentThread] threadDictionary][@"SPTCurrentSpec"];
  NSString *name;
  if ([compiledExample respondsToSelector:@selector(name)]) {
    // Specta 0.3 syntax
    name = [compiledExample performSelector:@selector(name)];
//  } else if ([compiledExample respondsToSelector:@selector(fileName)]) {
//    // Specta 0.2 syntax
//    name = [compiledExample performSelector:@selector(fileName)];
  }
  name = [[[[name componentsSeparatedByString:@" test_"] lastObject] stringByReplacingOccurrencesOfString:@"__" withString:@"_"] stringByReplacingOccurrencesOfString:@"]" withString:@""];
  return NSSelectorFromString(name);
}

- (void)runReactTestInRecordMode:(BOOL)recordMode
                          module:(NSString *)moduleName
                           props:(NSDictionary * _Nullable)props;
{
  BOOL before = self.reactTestRunner.recordMode;
  @try {
    self.reactTestRunner.recordMode = recordMode;
    [self.reactTestRunner runTest:currentTestName()
                           module:moduleName
                     initialProps:props
               configurationBlock:^(RCTRootView *rootView) {
      rootView.frame = [[UIScreen mainScreen] bounds];
    }];
  }
  @finally {
    self.reactTestRunner.recordMode = before;
  }
}

@end
