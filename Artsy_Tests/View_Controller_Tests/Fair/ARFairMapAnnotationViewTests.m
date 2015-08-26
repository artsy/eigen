#import "ARFairMapAnnotationView.h"


@interface ARFairMapAnnotationView (Testing)
@property (nonatomic, readonly) UILabel *primaryTitleLabel;
@end

SpecBegin(ARFairMapAnnotationView);

__block ARFairMapAnnotationView *annotationView = nil;

beforeEach(^{
    annotationView = [ARFairMapAnnotationView new];
    annotationView.displayTitle = @"Jackson Pollock";
});

describe(@"reduceToPoint", ^{
    it(@"hides the complete annotation on a default feature", ^{
        annotationView.mapFeatureType = ARMapFeatureTypeDefault;
        [annotationView reduceToPoint];
        expect(annotationView.isHidden).to.equal(YES);
    });

    it(@"only hides the annotation’s label on a highlighted feature", ^{
        annotationView.mapFeatureType = ARMapFeatureTypeHighlighted;
        [annotationView reduceToPoint];
        expect(annotationView.isHidden).to.equal(NO);
        expect(annotationView.primaryTitleLabel.isHidden).to.equal(YES);
    });
});

describe(@"expandToFull", ^{
    it(@"always makes every element visible", ^{
        annotationView.hidden = YES;
        annotationView.primaryTitleLabel.hidden = YES;
        [annotationView expandToFull];
        expect(annotationView.isHidden).to.equal(NO);
        expect(annotationView.primaryTitleLabel.isHidden).to.equal(NO);
    });
});

SpecEnd;
