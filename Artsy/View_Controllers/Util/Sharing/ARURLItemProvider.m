#import "ARURLItemProvider.h"
#import "ARFileUtils.h"
#import "ARRouter.h"


@implementation ARURLItemProvider

- (instancetype)initWithMessage:(NSString *)message path:(NSString *)path thumbnailImageURL:(NSURL *)thumbnailImageURL
{
    NSURL *shareableURL = [NSURL URLWithString:path relativeToURL:[ARRouter baseWebURL]];

    // sharing the URL built with URLWithString:relativeToURL via AirDrop: fails with a declined error message
    self = [super initWithPlaceholderItem:[NSURL URLWithString:shareableURL.absoluteString]];
    if (!self) {
        return nil;
    }
    _thumbnailImageURL = thumbnailImageURL;
    _message = message;
    return self;
}

- (UIImage *)activityViewController:(UIActivityViewController *)activityViewController
      thumbnailImageForActivityType:(NSString *)activityType
                      suggestedSize:(CGSize)size
{
    if ([activityType isEqualToString:UIActivityTypeAirDrop]) {
        return [UIImage imageNamed:@"AppIcon_120"];
    }

    if (!self.thumbnailImage && self.thumbnailImageURL) {
        NSData *imageData = [[NSData alloc] initWithContentsOfURL:self.thumbnailImageURL];
        _thumbnailImage = [UIImage imageWithData:imageData];
    }

    return self.thumbnailImage;
}

- (id)item
{
    if ([self.activityType isEqualToString:UIActivityTypeAirDrop]) {
        // https://engineering.eventbrite.com/setting-the-title-of-airdrop-shares-under-ios-7
        // replace slashes with a look-alike unicode character
        NSString *safeFilename = [self.message stringByReplacingOccurrencesOfString:@"/" withString:@"\u2215"];
        // remove quotes
        safeFilename = [safeFilename stringByReplacingOccurrencesOfString:@"\"" withString:@""];
        // append filename extension
        safeFilename = [safeFilename stringByAppendingString:@".Artsy"];
        NSURL *filename = [NSURL fileURLWithPath:[ARFileUtils cachesPathWithFolder:@"Airdrop" filename:safeFilename]];
        id JSON = @{ @"version" : @(1),
                     @"url" : [self.placeholderItem absoluteString] };
        NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
        [data writeToURL:filename atomically:YES];
        return filename;
    } else {
        return self.placeholderItem;
    }
}

@end
