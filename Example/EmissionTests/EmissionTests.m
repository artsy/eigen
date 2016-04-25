#import "TestHelper.h"

#import <XCTest/XCTest.h>

#import <React/RCTRootView.h>
#import <React/RCTTestRunner.h>

@interface EmissionTests : XCTestCase
@property (nonatomic, strong, readwrite) RCTTestRunner *reactTestRunner;
@end

@implementation EmissionTests

- (void)setUp;
{
  [super setUp];

  NSURL *URL = TestHelper.sharedHelper.fixturesURL;
  URL = [URL URLByAppendingPathComponent:@"ReferenceImages"];

  self.reactTestRunner = [[RCTTestRunner alloc] initWithApp:@"EmissionTests/TestApps"
                                         referenceDirectory:URL.path
                                             moduleProvider:nil];
}

- (void)tearDown;
{
  self.reactTestRunner = nil;
  [super tearDown];
}

- (void)testOpaqueImageViewWithAspectRatioAndAutoSizing;
{
//  self.reactTestRunner.recordMode = YES;

  NSDictionary *artwork = TestHelper.sharedHelper.artworks[0];

  NSDictionary *props = @{
    @"imageURL": [artwork valueForKeyPath:@"image.resized.url"],
    @"aspectRatio": [artwork valueForKeyPath:@"image.aspect_ratio"],
    @"style": @{ @"backgroundColor": @"red" },
  };

  [self.reactTestRunner runTest:_cmd
                         module:@"OpaqueImageView"
                   initialProps:props
             configurationBlock:^(RCTRootView *rootView) {
    rootView.frame = [[UIScreen mainScreen] bounds];
  }];
}

@end
