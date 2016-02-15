#import "ARSearchFieldButton.h"

#import "ARFonts.h"

#import <Artsy_UILabels/ARLabelSubclasses.h>
#import <EDColor/EDColor.h>
#import <ReactiveCocoa/ReactiveCocoa.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


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
    [self.imageView alignCenterYWithView:self predicate:@"0"];
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
    [self.label alignTrailingEdgeWithView:self predicate:@"0"];
    [self.label alignTop:@"2" bottom:@"0" toView:self];

    return self;
}

- (void)setDelegate:(id<ARSearchFieldButtonDelegate>)delegate
{
    _delegate = delegate;

    for (UIGestureRecognizer *gesture in self.gestureRecognizers.copy) {
        [self removeGestureRecognizer:gesture];
    }

    UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc] init];
    [recognizer addTarget:delegate action:@selector(searchFieldButtonWasPressed:)];
    [self addGestureRecognizer:recognizer];
}

- (CGSize)intrinsicContentSize
{
    return CGSizeMake(UIViewNoIntrinsicMetric, 48);
}

@end
