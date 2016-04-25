#import "TestHelper.h"

#import <SDWebImage/SDImageCache.h>
#import <SDWebImage/SDWebImageManager.h>

@interface TestHelper ()
@property (nonatomic, strong, readwrite) UIWindow *window;
@property (nonatomic, strong, readwrite) NSArray<NSDictionary *> *artworksPages;
@property (nonatomic, strong, readwrite) NSArray<NSDictionary *> *artworks;
@end

@implementation TestHelper

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

- (NSURL *)fixturesURL;
{
  NSURL *testsDir = [[NSURL fileURLWithPath:@(__FILE__)] URLByDeletingLastPathComponent];
  return [testsDir URLByAppendingPathComponent:@"Fixtures"];
}

- (void)assertCorrectEnvironment;
{
  NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;

  NSAssert(version.majorVersion == 9,
           @"The tests should be run on iOS 9.x, not %ld.%ld", version.majorVersion, version.minorVersion);
  
  CGSize nativeResolution = [UIScreen mainScreen].nativeBounds.size;
  NSAssert([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone && CGSizeEqualToSize(nativeResolution, CGSizeMake(750, 1334)),
           @"The tests should be run on an iPhone 6, not a device with native resolution %@",
           NSStringFromCGSize(nativeResolution));
}

static NSDictionary *
LoadJSONFixture(NSBundle *bundle, NSString *filename)
{
  NSData *data = [NSData dataWithContentsOfURL:[bundle URLForResource:filename withExtension:@"json"]];
  return [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
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

@end