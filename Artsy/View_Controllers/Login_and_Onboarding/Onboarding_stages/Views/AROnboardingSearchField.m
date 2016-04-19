#import "AROnboardingSearchField.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

#define CLEAR_BUTTON_TAG 0xbada55


@interface AROnboardingSearchField ()
@property (nonatomic, assign) BOOL swizzledClear;
@property (nonatomic, strong) UIImageView *searchIcon;

@end


@implementation AROnboardingSearchField

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.backgroundColor = [UIColor artsyGrayLight];

        _searchField = [[UITextField alloc] init];
        self.searchField.font = [UIFont serifFontWithSize:18];
        self.searchField.textColor = [UIColor blackColor];
        self.searchField.backgroundColor = [UIColor clearColor];
        self.searchField.attributedPlaceholder = [[NSAttributedString alloc]
            initWithString:@"Search artist"
                attributes:@{
                    NSFontAttributeName : [UIFont serifFontWithSize:18],
                    NSForegroundColorAttributeName : [UIColor artsyGrayMedium]
                }];
        [self addSubview:self.searchField];

        self.searchIcon = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"SearchButton"]];
        self.searchIcon.contentMode = UIViewContentModeScaleAspectFit;
        [self addSubview:self.searchIcon];

        [self.searchIcon alignTopEdgeWithView:self predicate:@"5"];
        [self.searchIcon alignLeadingEdgeWithView:self predicate:@"5"];
        [self.searchIcon alignBottomEdgeWithView:self predicate:@"-5"];
        [self.searchIcon constrainWidth:@"20"];

        [self.searchField constrainLeadingSpaceToView:self.searchIcon predicate:@"10"];
        [self.searchField alignTrailingEdgeWithView:self predicate:@"-5"];
        [self.searchField constrainHeightToView:self predicate:@"0"];
        [self.searchField alignTopEdgeWithView:self predicate:@"0"];
    }

    return self;
}

//- (id)initWithFrame:(CGRect)frame
//{
//    self = [super initWithFrame:frame];
//    if (!self) return nil;
//
//    self.backgroundColor = [UIColor clearColor];
//    self.font = [UIFont serifFontWithSize:20];
//
//    self.textColor = [UIColor artsyGrayRegular];
//    CALayer *baseline = [CALayer layer];
//    baseline.backgroundColor = [UIColor artsyGraySemibold].CGColor;
//    baseline.frame = CGRectMake(0, CGRectGetHeight(self.frame) - 1, CGRectGetWidth(self.bounds), 1);
//
//    self.clipsToBounds = NO;
//    [self.layer addSublayer:baseline];
//
//    self.clearButtonMode = UITextFieldViewModeWhileEditing;
//
//    return self;
//}
//
//- (void)setPlaceholder:(NSString *)placeholder
//{
//    self.attributedPlaceholder = [[NSAttributedString alloc] initWithString:placeholder attributes:@{NSForegroundColorAttributeName : [UIColor artsyGraySemibold]}];
//}
//
//- (void)addSubview:(UIView *)view
//{
//    [super addSubview:view];
//
//    if (!self.swizzledClear && [view class] == [UIButton class]) {
//        UIView *subview = (UIView *)view.subviews.firstObject;
//        if ([subview class] == [UIImageView class]) {
//            [self swizzleClearButton:(UIButton *)view];
//        }
//    }
//}
//
//- (void)layoutSubviews
//{
//    [super layoutSubviews];
//    UIButton *button = (UIButton *)[self viewWithTag:CLEAR_BUTTON_TAG];
//    if (button) {
//        button.center = CGPointMake(button.center.x, button.center.y - 3);
//    }
//}
//
//- (void)swizzleClearButton:(UIButton *)button
//{
//    UIImageView *imageView = (UIImageView *)button.subviews.firstObject;
//    UIImage *image = [imageView image];
//    UIImage *templated = [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
//    [button setImage:templated forState:UIControlStateNormal];
//    [button setImage:templated forState:UIControlStateHighlighted];
//    [button setTintColor:[UIColor whiteColor]];
//    self.swizzledClear = YES;
//    button.tag = CLEAR_BUTTON_TAG;
//}
@end
