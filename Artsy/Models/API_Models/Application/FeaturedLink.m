#import "FeaturedLink.h"

#import "ARMacros.h"

#import <ReactiveObjC/ReactiveObjC.h>

@interface FeaturedLink ()
@property (nonatomic, copy, readonly) NSString *urlFormatString;
@property (readwrite, nonatomic, copy) NSString *href;
@end


@implementation FeaturedLink

#pragma mark - Lifecycle

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _displayOnMobile = YES;

    return self;
}

#pragma mark - MTLJSONSerializing

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(FeaturedLink.new, featuredLinkID) : @"id",
        ar_keypath(FeaturedLink.new, urlFormatString) : @"image_url",
        ar_keypath(FeaturedLink.new, title) : @"title",
        ar_keypath(FeaturedLink.new, subtitle) : @"subtitle",
        ar_keypath(FeaturedLink.new, href) : @"href",
        ar_keypath(FeaturedLink.new, displayOnMobile) : @"display_on_mobile"
    };
}

#pragma mark - Properties

- (NSURL *)largeImageURL
{
    return [NSURL URLWithString:[self.urlFormatString stringByReplacingOccurrencesOfString:@":version" withString:@"large_rectangle"]];
}

- (NSURL *)smallImageURL
{
    return [NSURL URLWithString:[self.urlFormatString stringByReplacingOccurrencesOfString:@":version" withString:@"medium_rectangle"]];
}

- (NSURL *)smallSquareImageURL
{
    return [NSURL URLWithString:[self.urlFormatString stringByReplacingOccurrencesOfString:@":version" withString:@"small_square"]];
}

- (NSURL *)largeSquareImageURL
{
    return [NSURL URLWithString:[self.urlFormatString stringByReplacingOccurrencesOfString:@":version" withString:@"large_square"]];
}

- (NSString *)linkedObjectID
{
    if (self.href.length) {
        return [self.href componentsSeparatedByString:@"/"][2];
    }

    return nil;
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        FeaturedLink *featuredLink = object;
        return [featuredLink.featuredLinkID isEqualToString:self.featuredLinkID] || self == object;
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.featuredLinkID.hash;
}

- (NSString *)href
{
    return [_href stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
}

@end
