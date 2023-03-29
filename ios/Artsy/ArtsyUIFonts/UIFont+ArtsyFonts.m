// NOTE: This file should be a copy and paste of
//       https://github.com/artsy/Artsy-OSSUIFonts/blob/master/Pod/Classes/UIFont+ArtsyFonts.m

#import "UIFont+ArtsyFonts.h"
#import <CoreText/CoreText.h>
#import <react-native-config/ReactNativeConfig.h>

// Based on https://github.com/CocoaPods-Fonts/OpenSans/blob/874e65bc21abe54284e195484d2259b2fe858680/UIFont%2BOpenSans.m

@interface ARFontLoader: NSObject

+ (void)loadFontWithFileName:(NSString *)fontFileName extension:(NSString *)extension;

@end

@implementation ARFontLoader

+ (void)loadFontWithFileName:(NSString *)fontFileName extension:(NSString *)extension {
    NSBundle *bundle = [NSBundle bundleForClass:self];
    NSURL *fontURL = [bundle URLForResource:fontFileName withExtension:extension];
    NSData *fontData = [NSData dataWithContentsOfURL:fontURL];

    CGDataProviderRef provider = CGDataProviderCreateWithCFData((CFDataRef)fontData);
    CGFontRef font = CGFontCreateWithDataProvider(provider);

    if (font) {
        CFErrorRef errorRef = NULL;
        if (CTFontManagerRegisterGraphicsFont(font, &errorRef) == NO) {
            NSError *error = (__bridge NSError *)errorRef;
            if (error.code == kCTFontManagerErrorAlreadyRegistered || error.code == kCTFontManagerErrorDuplicatedName) {
                // nop - the font must have been registered by someone else already.
            } else {
                @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:error.localizedDescription userInfo:@{ NSUnderlyingErrorKey: error }];
            }
        }

        CFRelease(font);
    }

    if (provider) {
        CFRelease(provider);
    }
}

@end

@implementation UIFont (ArtsyFonts)

+ (instancetype)ar_LoadAndReturnFont:(NSString *)fontName extension:(NSString *)extension size:(CGFloat)fontSize onceToken:(dispatch_once_t *)onceToken {
    // Overload to default to fontName for fontFileName
    return [self ar_LoadAndReturnFont:fontName extension:extension size:fontSize onceToken:onceToken fontFileName:fontName];
}

+ (instancetype)ar_LoadAndReturnFont:(NSString *)fontName extension:(NSString *)extension size:(CGFloat)fontSize onceToken:(dispatch_once_t *)onceToken fontFileName:(NSString *)fontFileName {

    dispatch_once(onceToken, ^{
        [ARFontLoader loadFontWithFileName:fontFileName extension:extension];
    });

    return [self fontWithName:fontName size:fontSize];
}

+ (UIFont *)serifSemiBoldFontWithSize:(CGFloat)size
{
    static dispatch_once_t onceToken;
  return [self ar_LoadAndReturnFont:@"Unica77LL-Medium" extension:@"otf" size:size onceToken:&onceToken fontFileName:@"Unica77LL-Medium"];
}

+ (UIFont *)serifFontWithSize:(CGFloat)size
{
  static dispatch_once_t onceToken;
  return [self ar_LoadAndReturnFont:@"Unica77LL-Regular" extension:@"otf" size:size onceToken:&onceToken fontFileName:@"Unica77LL-Regular"];
}

+ (UIFont *)serifItalicFontWithSize:(CGFloat)size
{
  static dispatch_once_t onceToken;
  return [self ar_LoadAndReturnFont:@"Unica77LL-Italic" extension:@"otf" size:size onceToken:&onceToken fontFileName:@"Unica77LL-Italic"];
}

+ (UIFont *)sansSerifFontWithSize:(CGFloat)size
{
  static dispatch_once_t onceToken;
  return [self ar_LoadAndReturnFont:@"Unica77LL-Medium" extension:@"otf" size:size onceToken:&onceToken fontFileName:@"Unica77LL-Medium"];
}

/// Unica Medium
+ (UIFont *)displayMediumSansSerifFontWithSize:(CGFloat)size
{
    static dispatch_once_t onceToken;
    return [self ar_LoadAndReturnFont:@"Unica77LL-Medium" extension:@"otf" size:size onceToken:&onceToken fontFileName:@"Unica77LL-Medium"];
}

@end
