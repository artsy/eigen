#import "ARImageItemProvider.h"


@implementation ARImageItemProvider

- (id)item
{
    if ([self.activityType isEqualToString:UIActivityTypeMail] || [self.activityType isEqualToString:UIActivityTypeCopyToPasteboard]) {
        return self.placeholderItem;
    } else {
        return [NSNull null];
    }
}

@end
