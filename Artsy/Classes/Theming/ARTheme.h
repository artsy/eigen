#import "ARThemedFactory.h"

@class ARThemeFontVendor, ARThemeLayoutVendor, ARThemeColorVendor, ARThemeConstantVendor;

/// The ARTheme will use a bundled JSON file to create a dictionary of values used
/// dealing with the visual aspects of the app. It uses object subscripting on other classes
/// to give types instances back.

/// Basically considered to be deprecated, you should not be using this in new code.

@interface ARTheme : NSObject

/// Get the shared instance
+ (void)setupWithBundleNamed:(NSString *)name;

/// Get the default theme, named themes will revert
/// to this if they can't find results in their own dicts
+ (ARTheme *)defaultTheme;

/// Get a named theme for scoped theming
+ (ARTheme *)themeNamed:(NSString *)theme;

/// Subscripting enabled accessor for fonts, caches
@property (nonatomic, readonly) ARThemeFontVendor *fonts;

/// Subscripting enabled accessor for strings
@property (nonatomic, readonly) ARThemeLayoutVendor *layout;

/// Subscripting enabled accessor for colors, caches
@property (nonatomic, readonly) ARThemeColorVendor *colors;

/// Returns a floating point value from the theme
- (CGFloat)floatForKey:(NSString *)defaultName;

@end

// We want to use subscripting, but we also want to have
// a way of typing what comes back, so [ARTheme theme].fonts[@"Main"]
// can return a UIFont * instead of an id.

@interface ARThemeVendor : NSObject

- (instancetype)initWithTheme:(ARTheme *)theme;

@end

@interface ARThemeLayoutVendor : ARThemeVendor

- (NSString *)objectForKeyedSubscript:(id <NSCopying>)key;
- (void)setObject:(NSString *)obj forKeyedSubscript:(id <NSCopying>)key;

@end

@interface ARThemeColorVendor : ARThemeVendor

- (UIColor *)objectForKeyedSubscript:(id <NSCopying>)key;
- (void)setObject:(NSString *)obj forKeyedSubscript:(id <NSCopying>)key;

@end

@interface ARThemeFontVendor : ARThemeVendor

- (UIFont *)objectForKeyedSubscript:(id <NSCopying>)key;
- (void)setObject:(UIFont *)obj forKeyedSubscript:(id <NSCopying>)key;

@end
