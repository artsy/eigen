#import <UIKit/UIKit.h>


@interface UIColor (ArtsyColors)

/// <span style='display:block;width:3em;height:2em;border:1px solid black;background:#cccccc'></span>
/// <br/> (#cccccc)
+ (UIColor *)artsyGrayMedium;

/// <span style='display:block;width:3em;height:2em;border:1px solid black;background:#666666'></span>
/// <br/> (#666666)
+ (UIColor *)artsyGraySemibold;

/// <span style='display:block;width:3em;height:2em;border:1px solid black;background:#333333'></span>
/// <br/> (#333333)
+ (UIColor *)artsyGrayBold;

/// <span style='display:block;width:3em;height:2em;border:1px solid black;background:#e2d2ff'></span>
/// <br/> (#e2d2ff)
+ (UIColor *)artsyPurpleLight;

+ (UIColor *)artsyColorFor:(NSString *)name;

@end
