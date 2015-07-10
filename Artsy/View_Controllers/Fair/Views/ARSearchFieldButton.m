#import "ARSearchFieldButton.h"


@interface ARSearchFieldButton ()

@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UILabel *label;

@end


@implementation ARSearchFieldButton

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self == nil) {
        return nil;
    }

    self.backgroundColor = [UIColor colorWithHex:0xf2f2f2];


    self.imageView = [[UIImageView alloc] init];
    self.imageView.image = [UIImage imageNamed:@"SearchIcon_HeavyGrey"];
    self.imageView.contentMode = UIViewContentModeScaleAspectFit;
    [self addSubview:self.imageView];
    [self.imageView alignCenterYWithView:self predicate:nil];
    [self.imageView alignLeadingEdgeWithView:self predicate:@"10"];
    [self.imageView constrainWidth:@"16"];
    [self.imageView constrainHeight:@"16"];

    self.label = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
    self.label.font = [UIFont serifFontWithSize:16];
    self.label.text = @"Find Exhibitors & Artists";
    self.label.numberOfLines = 0;
    self.label.textColor = [UIColor artsyHeavyGrey];
    self.label.backgroundColor = [UIColor clearColor];
    [self addSubview:self.label];
    [self.label alignLeadingEdgeWithView:self.imageView predicate:@"21"];
    [self.label alignTrailingEdgeWithView:self predicate:nil];
    [self.label alignTop:@"2" bottom:@"0" toView:self];

    UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc] init];
   @_weakify(self);
    [recognizer.rac_gestureSignal subscribeNext:^(id _) {
        @_strongify(self);
        [self.delegate searchFieldButtonWasPressed:self];
    }];
    [self addGestureRecognizer:recognizer];

    return self;
}

- (CGSize)intrinsicContentSize
{
    return CGSizeMake(UIViewNoIntrinsicMetric, 32);
}

@end
