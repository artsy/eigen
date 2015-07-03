#import "ARWatchNoResultsViewController.h"


@interface ARWatchNoResultsViewController ()
@end


@implementation ARWatchNoResultsViewController

+ (NSDictionary *)contextWithTitle:(NSString *)title subtitle:(NSString *)subtitle
{
    return @{ @"title" : title,
              @"subtitle" : subtitle };
}

- (void)awakeWithContext:(NSDictionary *)context
{
    [super awakeWithContext:context];

    self.titleLabel.text = [context[@"title"] uppercaseString];
    self.subtitleLabel.text = context[@"subtitle"];
}

@end
