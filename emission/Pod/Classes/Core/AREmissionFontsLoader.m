#import <Foundation/Foundation.h>

#if __has_include(<Artsy+UIFonts/UIFont+ArtsyFonts.h>)
#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>
#else
@import Artsy_UIFonts;
#endif

@interface AREmissionFontsLoader : NSObject
@end


@implementation AREmissionFontsLoader

// Currently Eigen also force loads these fonts on app launch,
// so not going to spend too much time on loading these lazily atm.
//
// For now we only need these 2 fonts.
//
+ (void)load;
{
  __unused UIFont *font = [UIFont serifBoldItalicFontWithSize:12];
  font = [UIFont serifBoldFontWithSize:12];
  font = [UIFont reactNativeSerifFontWithSize:12];
  font = [UIFont reactNativeSerifFontSemiboldWithSize:12];
  font = [UIFont reactNativeSerifFontItalicWithSize:12];
  font = [UIFont serifSemiBoldFontWithSize:12];
  font = [UIFont serifFontWithSize:12];
  font = [UIFont serifItalicFontWithSize:12];
  font = [UIFont sansSerifFontWithSize:12];
  font = [UIFont displaySansSerifFontWithSize:12];
  font = [UIFont displayItalicSansSerifFontWithSize:12];
  font = [UIFont displayMediumSansSerifFontWithSize:12];
  font = [UIFont displayMediumItalicSansSerifFontWithSize:12];
//  font = [UIFont smallCapsSerifFontWithSize:12];
}

@end
