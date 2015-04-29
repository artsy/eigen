#import "ARTestHelper.h"

@implementation ARTestHelper

+ (void)load;
{
    NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;
    NSAssert(version.majorVersion == 8 && version.minorVersion == 2,
             @"The tests should be run on iOS 8.2, not %ld.%ld", version.majorVersion, version.minorVersion);

    CGSize nativeResolution = [UIScreen mainScreen].nativeBounds.size;
    NSAssert([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone
                 && CGSizeEqualToSize(nativeResolution, CGSizeMake(750, 1334)),
             @"The tests should be run on an iPhone 6, not a device with native resolution %@",
             NSStringFromCGSize(nativeResolution));
}

@end
