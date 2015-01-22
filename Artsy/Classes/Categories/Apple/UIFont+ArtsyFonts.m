@implementation UIFont (ArtsyFonts)

+ (UIFont *)serifBoldItalicFontWithSize:(CGFloat)size
{
    return [UIFont fontWithName:@"AGaramondPro-BoldItalic" size:size];
}

+ (UIFont *)serifBoldFontWithSize:(CGFloat)size
{
    return [UIFont fontWithName:@"AGaramondPro-Bold" size:size];
}

+ (UIFont *)serifSemiBoldFontWithSize:(CGFloat)size
{
    return [UIFont fontWithName:@"AGaramondPro-Semibold" size:size];
}

+ (UIFont *)serifFontWithSize:(CGFloat)size
{
    return [UIFont fontWithName:@"AGaramondPro-Regular" size:size];
}

+ (UIFont *)serifItalicFontWithSize:(CGFloat)size
{
    return [UIFont fontWithName:@"AGaramondPro-Italic" size:size];
}

+ (UIFont *)sansSerifFontWithSize:(CGFloat)size
{
    return [UIFont fontWithName:@"AvantGardeGothicITCW01Dm" size:size];
}

+ (UIFont *)smallCapsSerifFontWithSize:(CGFloat)size
{
    NSArray *fontFeatureSettings = @[ @{ UIFontFeatureTypeIdentifierKey: @(38),
                                         UIFontFeatureSelectorIdentifierKey : @(1) } ];

    NSDictionary *fontAttributes = @{ UIFontDescriptorFeatureSettingsAttribute: fontFeatureSettings ,
                                      UIFontDescriptorNameAttribute: @"AGaramondPro-Regular",
                                      UIFontDescriptorSizeAttribute: @(size)} ;

    UIFontDescriptor *fontDescriptor = [ [UIFontDescriptor alloc] initWithFontAttributes: fontAttributes ];

    return [UIFont fontWithDescriptor:fontDescriptor size:size];

}

@end
