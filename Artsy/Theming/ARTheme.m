#import "ARTheme.h"

#import "ARLogger.h"

@import Artsy_UIFonts;
#import <EDColor/EDColor.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

static NSMutableDictionary *staticThemes;
static ARTheme *defaultTheme;


@interface ARTheme ()
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) ARThemeFontVendor *fonts;
@property (nonatomic, strong) ARThemeLayoutVendor *layout;
@property (nonatomic, strong) ARThemeColorVendor *colors;

@property (nonatomic, strong) NSDictionary *fontShortcuts;
@property (nonatomic, strong) NSMutableDictionary *themeDictionary;

@property (nonatomic, strong) NSCache *colorCache;
@property (nonatomic, strong) NSCache *fontCache;
@end


@implementation ARTheme

+ (void)load
{
    [ARTheme setupWithBundleNamed:@"Theme"];
}

+ (void)setupWithBundleNamed:(NSString *)name;
{
    [self themesFromLocalBundleNamed:name];
}

+ (NSArray *)themesFromLocalBundleNamed:(NSString *)name
{
    NSError *error = nil;
    NSData *data = [NSData dataWithContentsOfFile:[[NSBundle mainBundle] pathForResource:name ofType:@"json"]];
    NSArray *themeDictionaries = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    if (error) {
        ARErrorLog(@"Error parsing JSON for themes with filename %@ - %@ %@", name, error.localizedDescription, error.localizedFailureReason);
        return nil;
    }

    if (!staticThemes) {
        staticThemes = [NSMutableDictionary dictionary];
    }

    for (NSDictionary *dictionary in themeDictionaries) {
        ARTheme *theme = [[ARTheme alloc] initWithName:dictionary[@"name"] content:dictionary[@"content"]];
        [staticThemes setObject:theme forKey:theme.name];

        if ([theme.name isEqualToString:@"default"]) {
            defaultTheme = theme;
        }
    }

    return staticThemes.allValues;
}

+ (ARTheme *)defaultTheme
{
    return defaultTheme;
}

+ (ARTheme *)themeNamed:(NSString *)themeName
{
    return staticThemes[themeName];
}

- (instancetype)initWithName:(NSString *)name content:(NSDictionary *)content
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.colorCache = [[NSCache alloc] init];
    self.fontCache = [[NSCache alloc] init];

    self.name = name;
    self.themeDictionary = [content mutableCopy];
    self.fontShortcuts = @{
        @"Avant" : [UIFont sansSerifFontWithSize:12].familyName,
        @"Garamond" : [UIFont serifFontWithSize:12].familyName,
        @"GaramondBold" : [UIFont serifBoldFontWithSize:12].familyName
    };

    self.fonts = [[ARThemeFontVendor alloc] initWithTheme:self];
    self.layout = [[ARThemeLayoutVendor alloc] initWithTheme:self];
    self.colors = [[ARThemeColorVendor alloc] initWithTheme:self];

    return self;
}

- (id)itemWithKey:(id<NSCopying>)key
{
    id object = (self.themeDictionary[key]) ? self.themeDictionary[key] : [self.class defaultTheme].themeDictionary[key];
    if (!object) {
        ARErrorLog(@"ARTheme: Could not find item for key %@ in %@", self.name, key);
    }
    return object;
}

- (UIFont *)fontWithKey:(id<NSCopying>)key
{
    // JSON String format = Fontname@Size
    // If _anything_ is wrong we should just bail out and give a system font

    UIFont *cachedFont = [self.fontCache objectForKey:key];
    if (cachedFont) {
        return cachedFont;
    }

    NSString *fontString = [self itemWithKey:key];
    NSArray *components = [fontString split:@"@"];

    if (components.count != 2) {
        return [UIFont systemFontOfSize:16];
    }

    fontString = components[0];
    CGFloat fontSize = [components[1] floatValue];

    if (fontSize < 1) {
        fontSize = 15;
    }

    fontString = (self.fontShortcuts[fontString]) ? self.fontShortcuts[fontString] : fontString;

    UIFont *font = [UIFont fontWithName:fontString size:fontSize];
    if (font) {
        [self.fontCache setObject:font forKey:key];
        return font;
    }

    return [UIFont systemFontOfSize:16];
}

// Based on http://stackoverflow.com/questions/1560081/how-can-i-create-a-uicolor-from-a-hex-string

- (UIColor *)colorWithKey:(id<NSCopying>)key
{
    // JSON String format = #11FF33

    UIColor *cachedColor = [self.colorCache objectForKey:key];
    if (cachedColor) {
        return cachedColor;
    }

    UIColor *hotPink = [UIColor colorWithHex:0xecb5d5];

    NSString *hexString = [self itemWithKey:key];
    if (!hexString) {
        return hotPink;
    }

    if (![[hexString substringToIndex:1] isEqualToString:@"#"]) {
        return hotPink;
    }

    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1]; // bypass '#' character
    [scanner scanHexInt:&rgbValue];
    UIColor *color = [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16) / 255.0
                                     green:((rgbValue & 0xFF00) >> 8) / 255.0
                                      blue:(rgbValue & 0xFF) / 255.0
                                     alpha:1.0];

    return color ? color : hotPink;
}

- (CGFloat)floatForKey:(NSString *)defaultName
{
    return [self numberWithKey:defaultName].floatValue;
}

- (NSNumber *)numberWithKey:(id<NSCopying>)key
{
    NSNumber *number = [self itemWithKey:key];
    if ([number isKindOfClass:[NSString class]]) {
        number = @([number floatValue]);
    }

    if (!number || ![number isKindOfClass:[NSNumber class]]) {
        return @(-1);
    }

    return number;
}

@end


@interface ARThemeVendor ()
@property (nonatomic, strong) ARTheme *theme;
@end


@implementation ARThemeVendor

- (instancetype)initWithTheme:(ARTheme *)theme
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _theme = theme;

    return self;
}

@end


@implementation ARThemeFontVendor

- (UIFont *)objectForKeyedSubscript:(id<NSCopying>)key;
{
    return [self.theme fontWithKey:key];
}

- (void)setObject:(UIFont *)obj forKeyedSubscript:(id<NSCopying>)key;
{
    self.theme.themeDictionary[key] = obj;
}

@end


@implementation ARThemeLayoutVendor

- (NSString *)objectForKeyedSubscript:(id<NSCopying>)key
{
    return [self.theme itemWithKey:key];
}

- (void)setObject:(id)obj forKeyedSubscript:(id<NSCopying>)key
{
    self.theme.themeDictionary[key] = obj;
}

@end


@implementation ARThemeColorVendor

- (UIColor *)objectForKeyedSubscript:(id<NSCopying>)key
{
    return [self.theme colorWithKey:key];
}

- (void)setObject:(id)obj forKeyedSubscript:(id<NSCopying>)key
{
    self.theme.themeDictionary[key] = obj;
}

@end
