#import "SiteHeroUnit.h"

#import "ARStandardDateFormatter.h"
#import "ARSystemTime.h"

#import "ARMacros.h"
#import "UIDevice-Hardware.h"

#import <EDColor/EDColor.h>
#import <ReactiveCocoa/ReactiveCocoa.h>

@interface SiteHeroUnit ()
@property (nonatomic, copy, readonly) NSString *buttonColorHex;
@property (nonatomic, copy, readonly) NSString *inverseButtonColorHex;
@end


@implementation SiteHeroUnit

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(SiteHeroUnit.new, siteHeroUnitID) : @"id",
        ar_keypath(SiteHeroUnit.new, heading) : @"heading",
        ar_keypath(SiteHeroUnit.new, title) : @"mobile_title",
        ar_keypath(SiteHeroUnit.new, titleImageAddress) : @"title_image_retina_url",
        ar_keypath(SiteHeroUnit.new, body) : @"mobile_description",
        ar_keypath(SiteHeroUnit.new, backgroundColor) : @"menu_color_class",
        ar_keypath(SiteHeroUnit.new, mobileBackgroundColor) : @"mobile_menu_color_class",
        ar_keypath(SiteHeroUnit.new, name) : @"name",
        ar_keypath(SiteHeroUnit.new, link) : @"link",
        ar_keypath(SiteHeroUnit.new, linkText) : @"link_text",
        ar_keypath(SiteHeroUnit.new, buttonColorHex) : @"link_color_off_hex",
        ar_keypath(SiteHeroUnit.new, inverseButtonColorHex) : @"link_color_hover_hex",
        ar_keypath(SiteHeroUnit.new, creditLine) : @"credit_line",
        ar_keypath(SiteHeroUnit.new, mobileBackgroundImageAddress) : @"background_image_mobile_url",
        ar_keypath(SiteHeroUnit.new, backgroundImageAddress) : @"background_image_url",
        ar_keypath(SiteHeroUnit.new, position) : @"position",
        ar_keypath(SiteHeroUnit.new, startDate) : @"start_at",
        ar_keypath(SiteHeroUnit.new, endDate) : @"end_at",
        ar_keypath(SiteHeroUnit.new, alignment) : @"type"
    };
}

+ (NSValueTransformer *)enabledJSONTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

+ (NSValueTransformer *)displayOnMobileJSONTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

+ (NSValueTransformer *)startDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)endDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)alignmentJSONTransformer
{
    return [NSValueTransformer mtl_valueMappingTransformerWithDictionary:@{
        @"left" : @(ARHeroUnitAlignmentLeft),
        @"right" : @(ARHeroUnitAlignmentRight)
    } defaultValue:@(ARHeroUnitAlignmentLeft) reverseDefaultValue:@"left"];
}

- (enum ARHeroUnitImageColor)backgroundStyle
{
    NSString *color = self.backgroundColor;

    // Prioritise mobile prefixed colours
    if (self.mobileBackgroundColor && self.mobileBackgroundColor.length > 0) {
        color = self.mobileBackgroundColor;
    }

    if ([color isEqualToString:@"black"]) {
        return ARHeroUnitImageColorBlack;
    }
    return ARHeroUnitImageColorWhite;
}

- (NSURL *)titleImageURL
{
    NSString *address = self.titleImageAddress;
    return [NSURL URLWithString:[address stringByRemovingPercentEncoding]];
}

- (NSURL *)preferredImageURL
{
    NSString *address = self.backgroundImageAddress;
    if (self.mobileBackgroundImageAddress && ![UIDevice isPad]) {
        address = self.mobileBackgroundImageAddress;
    }
    return [NSURL URLWithString:[address stringByRemovingPercentEncoding]];
}

- (BOOL)isCurrentlyActive
{
    NSDate *now = [ARSystemTime date];
    return (([now compare:self.startDate] != NSOrderedAscending) &&
            ([now compare:self.endDate] != NSOrderedDescending));
}

- (UIColor *)buttonColor
{
    return [UIColor colorWithHexString:self.buttonColorHex];
}

- (UIColor *)inverseButtonColor
{
    return [UIColor colorWithHexString:self.inverseButtonColorHex];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        SiteHeroUnit *siteHeroUnit = object;
        return [siteHeroUnit.siteHeroUnitID isEqualToString:self.siteHeroUnitID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.siteHeroUnitID.hash;
}

@end
