#import "ARStandardDateFormatter.h"

@interface SiteHeroUnit ()
@property (nonatomic, copy, readonly) NSString *buttonColorHex;
@property (nonatomic, copy, readonly) NSString *inverseButtonColorHex;
@end

@implementation SiteHeroUnit

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @keypath(SiteHeroUnit.new, siteHeroUnitID): @"id",
        @keypath(SiteHeroUnit.new, heading): @"heading",
        @keypath(SiteHeroUnit.new, title): @"mobile_title",
        @keypath(SiteHeroUnit.new, titleImageAddress): @"title_image_retina_url",
        @keypath(SiteHeroUnit.new, body): @"mobile_description",
        @keypath(SiteHeroUnit.new, backgroundColor): @"menu_color_class",
        @keypath(SiteHeroUnit.new, mobileBackgroundColor): @"mobile_menu_color_class",
        @keypath(SiteHeroUnit.new, name): @"name",
        @keypath(SiteHeroUnit.new, link): @"link",
        @keypath(SiteHeroUnit.new, linkText): @"link_text",
        @keypath(SiteHeroUnit.new, buttonColorHex): @"link_color_off_hex",
        @keypath(SiteHeroUnit.new, inverseButtonColorHex): @"link_color_hover_hex",
        @keypath(SiteHeroUnit.new, creditLine): @"credit_line",
        @keypath(SiteHeroUnit.new, mobileBackgroundImageAddress) : @"background_image_mobile_url",
        @keypath(SiteHeroUnit.new, backgroundImageAddress): @"background_image_url",
        @keypath(SiteHeroUnit.new, position): @"position",
        @keypath(SiteHeroUnit.new, startDate): @"start_at",
        @keypath(SiteHeroUnit.new, endDate): @"end_at",
        @keypath(SiteHeroUnit.new, alignment): @"type"
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
        @"left":@(ARHeroUnitAlignmentLeft),
        @"right":@(ARHeroUnitAlignmentRight)
    } defaultValue:@(ARHeroUnitAlignmentLeft) reverseDefaultValue:@"left"];
}

- (enum ARHeroUnitImageColor)backgroundStyle
{
    NSString *color = self.backgroundColor;

    // Prioritise mobile prefixed colours
    if (self.mobileBackgroundColor && self.mobileBackgroundColor.length > 0) {
        color = self.mobileBackgroundColor;
    }

    if ([color isEqualToString:@"black"]){
        return ARHeroUnitImageColorBlack;
    }
    return ARHeroUnitImageColorWhite;
}

- (NSURL *)titleImageURL
{
    NSString *address = self.titleImageAddress;
    return [NSURL URLWithString:[address stringByAddingPercentEscapesUsingEncoding: NSASCIIStringEncoding]];
}

- (NSURL *)preferredImageURL
{
    NSString *address = self.backgroundImageAddress;
    if (self.mobileBackgroundImageAddress && ![UIDevice isPad]) {
        address = self.mobileBackgroundImageAddress;
    }
    return [NSURL URLWithString:[address stringByAddingPercentEscapesUsingEncoding: NSASCIIStringEncoding]];
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
    if([object isKindOfClass:[self class]]) {
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
