#import "TestHelper.h"

#import <XCTest/XCTest.h>


SpecBegin(OpaqueImageViewComponent)

describe(@"OpaqueImageViewComponent", ^{
  __block TestHelper *helper = nil;

  beforeAll(^{
    helper = TestHelper.sharedHelper;
  });

  it(@"maintains the aspect ratio when automatically sizing to fill the available size", ^{
    NSDictionary *artwork = helper.artworks[0];
    [helper runReactTestInRecordMode:NO
                              module:@"OpaqueImageView"
                               props:@{
                                       @"imageURL": [artwork valueForKeyPath:@"image.resized.url"],
                                       @"aspectRatio": [artwork valueForKeyPath:@"image.aspect_ratio"],
                                       @"style": @{ @"backgroundColor": @"red" },
                                     }];
  });
});

SpecEnd

