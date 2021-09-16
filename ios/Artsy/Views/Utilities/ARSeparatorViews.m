#import "ARSeparatorViews.h"

#import "ARFonts.h"
#import <Artsy+UILabels/UIView+ARDrawing.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@implementation ARSeparatorView

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }
    self.backgroundColor = [UIColor artsyGrayRegular];
    [self constrainHeight:@"1"];

    self.accessibilityElementsHidden = YES;

    return self;
}

@end
