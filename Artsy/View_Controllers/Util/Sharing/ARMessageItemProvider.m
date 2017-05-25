#import "ARMessageItemProvider.h"

#import "ARSwitchBoard+Eigen.h"


@interface ARMessageItemProvider ()
@property (nonatomic, strong, readonly) NSString *path;
@property (nonatomic, strong, readonly) NSString *message;
@property (nonatomic, strong, readonly) NSURL *url;
@end


@implementation ARMessageItemProvider

- (instancetype)initWithMessage:(NSString *)message path:(NSString *)path
{
    self = [self initWithPlaceholderItem:message];
    if (!self) return nil;
    _path = path;
    return self;
}

- (id)item
{
    if ([self.activityType isEqualToString:UIActivityTypeMail]) {
        return [NSString stringWithFormat:@"<html><body><a href='%@'>%@</a></body></html>", self.url.absoluteString, self.message];
    } else if ([self.activityType isEqualToString:UIActivityTypeAddToReadingList]) {
        return self.url;
    } else if ([self.activityType isEqualToString:UIActivityTypeAirDrop]) {
        return [NSNull null]; // served by ARURLItemProvider
    } else {
        return self.message;
    }
}

- (NSString *)activityViewController:(UIActivityViewController *)activityViewController subjectForActivityType:(NSString *)activityType
{
    if ([activityType isEqualToString:UIActivityTypeMail]) {
        return self.message;
    } else {
        return @"";
    }
}

- (NSString *)message
{
    if ([self.activityType isEqualToString:UIActivityTypePostToTwitter]) {
        return [NSString stringWithFormat:@"%@ on @Artsy", self.placeholderItem];
    } else {
        return [NSString stringWithFormat:@"%@ on Artsy", self.placeholderItem];
    }
}

- (NSURL *)url
{
    return [ARSwitchBoard.sharedInstance resolveRelativeUrl:self.path];
}

@end
