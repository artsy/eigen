// There is a drawing class in there
@import Artsy_UILabels;


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
