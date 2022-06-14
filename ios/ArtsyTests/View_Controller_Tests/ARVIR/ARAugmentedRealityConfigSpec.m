#import "ARAugmentedRealityConfig.h"

#import <CoreGraphics/CoreGraphics.h>

SpecBegin(ARAugmentedRealityConfig);

it(@"converts greyscale images to RGB", ^{
    UIImage *image = [UIImage imageWithContentsOfFile:[[NSBundle bundleForClass:[self class]] pathForResource:@"greyscaleImage" ofType:@"jpg"]];
    // First check that the image is present (UIImage loading in unit test bundles is... unreliable).
    expect(image).toNot.beNil();
    CGColorSpaceRef originalColorSpace = CGImageGetColorSpace(image.CGImage);
    expect(CGColorSpaceGetNumberOfComponents(originalColorSpace)).to.equal(1);
    
    ARAugmentedRealityConfig *subject = [[ARAugmentedRealityConfig alloc] initWithImage:image size:CGSizeMake(5, 5)];
    CGColorSpaceRef subjectColorSpace = CGImageGetColorSpace(subject.image.CGImage);
    expect(CGColorSpaceGetNumberOfComponents(subjectColorSpace)).to.equal(3);
});

SpecEnd;
