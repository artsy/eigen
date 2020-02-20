#import "TestHelper.h"

#import <XCTest/XCTest.h>


SpecBegin(OpaqueImageViewComponent)

describe(@"OpaqueImageViewComponent", ^{
  __block TestHelper *helper = nil;
  __block NSDictionary<NSString *, NSMutableDictionary *> *props = nil;

  beforeEach(^{
    helper = TestHelper.sharedHelper;

    NSDictionary *artwork = helper.artworks[0];
    props = @{
      @"containerStyle": [@{
        @"backgroundColor": @"red",
        @"alignSelf": @"stretch",
      } mutableCopy],
      @"imageView": [@{
        @"imageURL": [artwork valueForKeyPath:@"image.resized.url"],
        @"aspectRatio": [artwork valueForKeyPath:@"image.aspect_ratio"],
      } mutableCopy],
    };
  });

  describe(@"with row layout", ^{
    beforeEach(^{
      props[@"containerStyle"][@"flexDirection"] = @"row";
    });

    // Should not show any of the red of the container.
    it(@"maintains the aspect ratio when automatically sizing to fill the available size", ^{
      props[@"imageView"][@"style"] = @{ @"flex": @1 };
      [helper runReactTestInRecordMode:NO module:@"OpaqueImageView" props:props];
    });

    // Should show red of the container next to it.
    it(@"maintains the aspect ration when given an explicit width", ^{
      props[@"imageView"][@"style"] = @{ @"width": @100 };
      [helper runReactTestInRecordMode:NO module:@"OpaqueImageView" props:props];
    });

    // Should show red of the container next to it.
    it(@"maintains the aspect ration when given an explicit height", ^{
      props[@"imageView"][@"style"] = @{ @"height": @100 };
      [helper runReactTestInRecordMode:NO module:@"OpaqueImageView" props:props];
    });
  });

  describe(@"with column layout", ^{
    beforeEach(^{
      props[@"containerStyle"][@"flexDirection"] = @"column";
    });

    // FIXME: This test is hanging, not sure why.
//    // Should not show any of the red of the container.
//    it(@"maintains the aspect ratio when automatically sizing to fill the available size", ^{
//      props[@"imageView"][@"style"] = @{ @"flex": @1 };
//      [helper runReactTestInRecordMode:YES module:@"OpaqueImageView" props:props];
//    });

    // Should show red of the container below it.
    it(@"maintains the aspect ration when given an explicit width", ^{
      // FIXME This shows as if it’s still a row, might be solved with RN 0.25-rc
      props[@"containerStyle"][@"flex"] = @1;
      props[@"containerStyle"][@"width"] = @100;

      props[@"imageView"][@"style"] = @{ @"width": @100 };
      [helper runReactTestInRecordMode:NO module:@"OpaqueImageView" props:props];
    });

    // FIXME: I’m not even sure right now what this one should look like.
//    //
//    // Should show red of the container below it.
//    xit(@"maintains the aspect ratio when given an explicit height", ^{
//      // props[@"containerStyle"][@"flex"] = @1;
//      // props[@"containerStyle"][@"width"] = @200x;
//      props[@"imageView"][@"style"] = @{ @"height": @100 };
//      [helper runReactTestInRecordMode:YES module:@"OpaqueImageView" props:props];
//    });
  });
});

SpecEnd

