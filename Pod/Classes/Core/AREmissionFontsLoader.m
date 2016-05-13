#import <Foundation/Foundation.h>

#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>

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
  font = [UIFont serifSemiBoldFontWithSize:12];
  font = [UIFont serifFontWithSize:12];
  font = [UIFont serifItalicFontWithSize:12];
  font = [UIFont sansSerifFontWithSize:12];
//  font = [UIFont smallCapsSerifFontWithSize:12];
}

@end
