#import <UIKit/UIKit.h>

@interface UIFont (ArtsyFonts)

/// Garamond
+ (UIFont *)serifFontWithSize:(CGFloat)size;

/// Garamond Semi Bold
+ (UIFont *)serifSemiBoldFontWithSize:(CGFloat)size;

/// Garamond Italic
+ (UIFont *)serifItalicFontWithSize:(CGFloat)size;

/// *** These RN-specific versions of Garamond exist to work around a line-height rendering bug in iOS *** ///
/// *** https://github.com/facebook/react-native/issues/7687#issuecomment-340068360 *** ///

/// Avant Garde
+ (UIFont *)sansSerifFontWithSize:(CGFloat)size;

/// Unica Medium
+ (UIFont *)displayMediumSansSerifFontWithSize:(CGFloat)size;

@end
