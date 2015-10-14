#import "ARSeparatorViews.h"

#import "ARFonts.h"
#import <Artsy_UILabels/UIView+ARDrawing.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@implementation ARSeparatorView

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }
    self.backgroundColor = [UIColor artsyLightGrey];
    [self constrainHeight:@"1"];
    return self;
}

@end


@implementation ARDottedSeparatorView

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }
    self.backgroundColor = [UIColor clearColor];
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    [self drawTopDottedBorder];
}

@end
