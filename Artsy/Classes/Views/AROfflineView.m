#import "AROfflineView.h"
#import "ORStackView+ArtsyViews.h"


@interface AROfflineView ()

@end


@implementation AROfflineView

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (!self) {
        return nil;
    }

    self.backgroundColor = [UIColor whiteColor];
    [self addWhiteSpaceWithHeight:@"200"];
    [self addSerifPageTitle:NSLocalizedString(@"Connection Error", @"Offline mode view title")
                   subtitle:NSLocalizedString(@"The internet connection\nappears to be offline.", @"Offline mode view subtitle")];

    return self;
}

@end
