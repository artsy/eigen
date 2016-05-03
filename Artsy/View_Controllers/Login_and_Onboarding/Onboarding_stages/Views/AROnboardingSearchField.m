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

        self.layer.borderColor = [UIColor artsyGrayMedium].CGColor;
        self.layer.borderWidth = 0.5f;
        self.layer.masksToBounds = YES;

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

- (void)setPlaceholder:(NSString *)placeholder
{
    self.searchField.attributedPlaceholder = [[NSAttributedString alloc]
        initWithString:placeholder
            attributes:@{
                NSFontAttributeName : [UIFont serifFontWithSize:18],
                NSForegroundColorAttributeName : [UIColor artsyGrayMedium]
            }];
}

@end
