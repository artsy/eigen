#import "ARFairMapAnnotationView.h"

@interface ARFairMapAnnotationView (Testing)
@property (nonatomic, readonly) UILabel *primaryTitleLabel;
@end

SpecBegin(ARFairMapAnnotationView)

__block ARFairMapAnnotationView *annotationView = nil;

describe(@"reduceToPoint, on a default feature", ^{
    beforeEach(^{
      annotationView = [ARFairMapAnnotationView new];
      annotationView.mapFeatureType = ARMapFeatureTypeDefault;
      annotationView.displayTitle = @"Jackson Pollock";
    });

    it(@"hides the complete annotation", ^{
      [annotationView reduceToPoint];
      expect(annotationView.isHidden).to.equal(YES);
    });

    it(@"only hides the annotation’s label", ^{
      annotationView.highlighted = YES;
      [annotationView reduceToPoint];
      expect(annotationView.isHidden).to.equal(NO);
      expect(annotationView.primaryTitleLabel.isHidden).to.equal(YES);
    });
});

SpecEnd
