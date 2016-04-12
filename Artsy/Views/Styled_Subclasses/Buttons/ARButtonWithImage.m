#import "ARButtonWithImage.h"

#import "ARFeedImageLoader.h"
#import "ARFonts.h"
#import "ARSeparatorViews.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

const CGFloat TitlesMargin = 5;


@interface ARButtonWithImage ()

@property (readonly, nonatomic, strong) UIView *contentView;

@property (readonly, nonatomic, strong) UIView *separatorView;

@property (readonly, nonatomic, strong) UIView *labelContainer;
@property (readonly, nonatomic, strong) UILabel *actualTitleLabel;
@property (readonly, nonatomic, strong) UILabel *subtitleLabel;
@property (readonly, nonatomic, strong) NSLayoutConstraint *titlesMarginConstraint;

@property (readonly, nonatomic, strong) UIImageView *buttonArrowView;

@property (readonly, nonatomic, strong) ARFeedImageLoader *imageLoader;

@end


@implementation ARButtonWithImage

#pragma mark - Lifecycle

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (!self) {
        return nil;
    }

    _contentView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(frame), CGRectGetHeight(frame))];
    _contentView.userInteractionEnabled = NO;
    [self addSubview:_contentView];

    _separatorView = [[ARSeparatorView alloc] init];
    [self.contentView addSubview:_separatorView];

    _buttonArrowView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"MoreArrow"]];
    _buttonArrowView.contentMode = UIViewContentModeCenter;
    _buttonArrowView.backgroundColor = [UIColor whiteColor];
    [self.contentView addSubview:_buttonArrowView];

    _buttonImageView = [[UIImageView alloc] init];
    _buttonImageView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView addSubview:_buttonImageView];

    _labelContainer = [[UIView alloc] init];
    [self.contentView addSubview:_labelContainer];

    _actualTitleLabel = [[UILabel alloc] init];
    _actualTitleLabel.font = [UIFont serifFontWithSize:20];
    _actualTitleLabel.numberOfLines = 0;
    [self.labelContainer addSubview:_actualTitleLabel];

    _subtitleLabel = [[UILabel alloc] init];
    _subtitleLabel.font = [UIFont serifFontWithSize:16];
    _subtitleLabel.textColor = [UIColor blackColor];
    _subtitleLabel.userInteractionEnabled = NO;
    _subtitleLabel.numberOfLines = 2;
    [self.labelContainer addSubview:_subtitleLabel];

    [self setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];

    _imageLoader = [[ARFeedImageLoader alloc] init];

    [self alignToView:self.contentView];

    [self.separatorView alignLeading:@"10" trailing:@"-10" toView:self.contentView];
    [self.separatorView alignBottomEdgeWithView:self.contentView predicate:@"0"];

    [self.buttonImageView constrainWidth:@"80"];
    [self.buttonImageView constrainHeight:@"80"];
    self.buttonImageView.contentMode = UIViewContentModeScaleAspectFill;
    self.buttonImageView.clipsToBounds = YES;

    [self.buttonImageView alignCenterYWithView:self.contentView predicate:@"0"];
    [self.buttonImageView alignLeadingEdgeWithView:self.contentView predicate:@"10"];

    [self.labelContainer constrainLeadingSpaceToView:self.buttonImageView predicate:@"20"];
    [self.labelContainer alignCenterYWithView:self.contentView predicate:@"0"];

    [self.labelContainer alignTopEdgeWithView:self.actualTitleLabel predicate:@"0"];
    [self.actualTitleLabel alignLeadingEdgeWithView:self.labelContainer predicate:@"0"];
    [self.actualTitleLabel alignTrailingEdgeWithView:self.labelContainer predicate:@"0"];
    _titlesMarginConstraint = [self.subtitleLabel constrainTopSpaceToView:self.actualTitleLabel predicate:@"0"];
    [self.subtitleLabel alignBottomEdgeWithView:self.labelContainer predicate:@"0"];

    [UIView alignLeadingAndTrailingEdgesOfViews:@[ self.actualTitleLabel, self.subtitleLabel, self.labelContainer ]];

    [self.buttonArrowView alignCenterYWithView:self.contentView predicate:@"0"];
    [self.buttonArrowView alignTrailingEdgeWithView:self.contentView predicate:@"-15@1000"];
    [self.buttonArrowView constrainLeadingSpaceToView:self.labelContainer predicate:@">=8@800"];

    // Constrain size of contentView to content
    [self.contentView alignTopEdgeWithView:self.buttonImageView predicate:@"<=-12"];
    [self.contentView alignBottomEdgeWithView:self.buttonImageView predicate:@">=13"];
    [self.contentView alignTopEdgeWithView:self.labelContainer predicate:@"<=-12"];
    [self.contentView alignBottomEdgeWithView:self.labelContainer predicate:@">=13"];

    return self;
}

#pragma mark - Properties

- (void)setTitle:(NSString *)title
{
    _title = [title copy];

    self.actualTitleLabel.text = title;
}

- (void)setSubtitle:(NSString *)subtitle
{
    _subtitle = [subtitle copy];

    self.subtitleLabel.text = subtitle;

    self.titlesMarginConstraint.constant = subtitle.length > 0 ? TitlesMargin : 0;
}

- (void)setImageURL:(NSURL *)imageURL
{
    _imageURL = imageURL;

    if (imageURL) {
        [self.imageLoader loadImageAtAddress:imageURL.absoluteString
                                 desiredSize:ARFeedItemImageSizeSmall
                                forImageView:self.buttonImageView
                           customPlaceholder:nil];
    }
}

- (void)setImage:(UIImage *)image
{
    if (image) {
        self.buttonImageView.image = image;
    }
}

- (void)setTitleFont:(UIFont *)titleFont
{
    self.actualTitleLabel.font = titleFont;
    _titleFont = titleFont;
}

- (void)setSubtitleFont:(UIFont *)subtitleFont
{
    self.subtitleLabel.font = subtitleFont;
    _subtitleFont = subtitleFont;
}

@end
