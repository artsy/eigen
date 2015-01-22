#import "ARButtonWithCircularImage.h"


@implementation ARButtonWithCircularImage

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (!self) { return nil; }
    self.buttonImageView.layer.cornerRadius = 40;
    self.buttonImageView.clipsToBounds = YES;

    return self;
}

@end
