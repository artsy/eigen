#import <UIKit/UIKit.h>

@interface UIView (ARDrawing)

// DOTTED BORDERS
//   Using default border color
- (void)drawDottedBorders;
- (void)drawTopDottedBorder;
- (void)drawBottomDottedBorder;

//   Specifying a border color
- (void)drawDottedBordersWithColor:(UIColor *)color;
- (void)drawTopDottedBorderWithColor:(UIColor *)color;
- (void)drawBottomDottedBorderWithColor:(UIColor *)color;

// SOLID BORDERS
//   Using default border color
- (void)drawSolidBorders;
- (void)drawTopSolidBorder;
- (void)drawBottomSolidBorder;

//   Specifying a border color
- (void)drawSolidBordersWithColor:(UIColor *)color;
- (void)drawTopSolidBorderWithColor:(UIColor *)color;
- (void)drawBottomSolidBorderWithColor:(UIColor *)color;

@end
