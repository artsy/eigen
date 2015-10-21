#import "ARNetworkErrorView.h"

#import "ARFonts.h"

#import <Artsy_UILabels/ARLabelSubclasses.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARNetworkErrorView ()
@property (nonatomic, strong) UILabel *errorText;
@end


@implementation ARNetworkErrorView

- (id)initWithCoder:(NSCoder *)aDecoder
{
    self = [super initWithCoder:aDecoder];
    if (!self) {
        return nil;
    }
    [self setup];
    return self;
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (!self) {
        return nil;
    }
    [self setup];
    return self;
}

- (void)setup
{
    self.backgroundColor = [UIColor whiteColor];
    self.errorText = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:2];
    self.errorText.font = [UIFont serifFontWithSize:12];
    self.errorText.text = @"Couldn't reach Artsy. Please check your internet connection or try again later.";
    self.errorText.textAlignment = NSTextAlignmentCenter;
    [self addSubview:self.errorText];
    [self.errorText alignLeading:@"20" trailing:@"-20" toView:self];
    [self.errorText alignCenterYWithView:self predicate:@"0"];
}

@end
