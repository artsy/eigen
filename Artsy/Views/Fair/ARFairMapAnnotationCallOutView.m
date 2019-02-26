#import "ARFairMapAnnotationCallOutView.h"

#import "ARFonts.h"
#import "PartnerShow.h"
#import "ARTheme.h"
#import "ARFairMapAnnotation.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARTopMenuViewController.h"

#import "UIImageView+AsyncImageLoading.h"

#import <NAMapKit/NAMapView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@interface ARFairMapAnnotationCallOutView ()

@property (nonatomic, strong, readonly) UILabel *partnerLocation;
@property (nonatomic, strong, readonly) UILabel *partnerName;
@property (nonatomic, strong, readonly) UIImageView *partnerImage;
@property (nonatomic, strong, readonly) UIImage *defaultPartnerImage;
@property (nonatomic, strong, readonly) UIImageView *anchorImage;
@property (nonatomic, strong, readonly) UIImageView *arrowImage;
@property (nonatomic, strong, readonly) UIView *verticalSeparator;

@property (nonatomic, assign) CGPoint position;

@property (nonatomic, weak) NAMapView *mapView;

@end


@implementation ARFairMapAnnotationCallOutView

- (id)initOnMapView:(NAMapView *)mapView fair:(Fair *)fair
{
    self = [super init];
    if (!self) {
        return nil;
    }

    [self constrainHeight:@"80"];

    UIView *container = [[UIView alloc] init];
    container.backgroundColor = [UIColor blackColor];
    [self addSubview:container];
    [container alignLeadingEdgeWithView:self predicate:@"0"];
    [container constrainHeight:@"60"];
    [container constrainWidth:[NSString stringWithFormat:@"%@", @(CGRectGetWidth(mapView.bounds) - 40)]];

    UIImageView *partnerImage = [[UIImageView alloc] init];
    [container addSubview:partnerImage];
    _partnerImage = partnerImage;
    _defaultPartnerImage = [UIImage imageNamed:@"MapAnnotationCallout_Partner"];
    [partnerImage constrainHeightToView:container predicate:@"-20"];
    [partnerImage alignAttribute:NSLayoutAttributeWidth toAttribute:NSLayoutAttributeHeight ofView:partnerImage predicate:@"0"];
    [partnerImage alignCenterYWithView:container predicate:@"0"];
    [partnerImage alignLeadingEdgeWithView:container predicate:@"10"];

    UIImageView *arrowImage = [[UIImageView alloc] init];
    [arrowImage setImage:[UIImage imageNamed:@"MapAnnotationCallout_Arrow"]];
    [container addSubview:arrowImage];
    _arrowImage = arrowImage;
    [arrowImage alignCenterYWithView:container predicate:@"0"];
    [arrowImage alignTrailingEdgeWithView:container predicate:@"-14"];
    [arrowImage setContentCompressionResistancePriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];
    [arrowImage setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];

    UIView *separator = [[UIView alloc] init];
    separator.backgroundColor = [UIColor artsyGrayRegular];
    [container addSubview:separator];
    _verticalSeparator = separator;
    [separator alignAttribute:NSLayoutAttributeRight toAttribute:NSLayoutAttributeLeft ofView:arrowImage predicate:@"-13"];
    [separator constrainWidth:@"1"];
    [separator alignTopEdgeWithView:container predicate:@"10"];
    [separator alignBottomEdgeWithView:container predicate:@"-10"];

    UIView *labelView = [[UIView alloc] init];
    [container addSubview:labelView];
    [labelView alignCenterYWithView:container predicate:@"0"];
    [labelView alignAttribute:NSLayoutAttributeLeft toAttribute:NSLayoutAttributeRight ofView:partnerImage predicate:@"10"];
    [labelView alignAttribute:NSLayoutAttributeRight toAttribute:NSLayoutAttributeLeft ofView:separator predicate:@"-13"];

    UILabel *partnerName = [ARThemedFactory labelForLinkItemTitles];
    partnerName.font = [partnerName.font fontWithSize:14];
    partnerName.textColor = [UIColor whiteColor];
    partnerName.backgroundColor = [UIColor clearColor];
    partnerName.numberOfLines = 1;
    partnerName.lineBreakMode = NSLineBreakByTruncatingTail;
    [labelView addSubview:partnerName];
    _partnerName = partnerName;
    [partnerName alignTopEdgeWithView:labelView predicate:@"0"];
    [partnerName alignLeadingEdgeWithView:labelView predicate:@"0"];
    [partnerName alignTrailingEdgeWithView:labelView predicate:@"0"];

    UILabel *partnerLocation = [ARThemedFactory labelForLinkItemTitles];
    partnerLocation.textColor = [UIColor artsyGrayMedium];
    partnerLocation.backgroundColor = [UIColor clearColor];
    partnerLocation.numberOfLines = 1;
    partnerLocation.font = [partnerLocation.font fontWithSize:11];
    partnerLocation.lineBreakMode = NSLineBreakByTruncatingHead;
    [labelView addSubview:partnerLocation];
    _partnerLocation = partnerLocation;
    [partnerLocation constrainTopSpaceToView:partnerName predicate:@"0"];
    [partnerLocation alignLeadingEdgeWithView:self.partnerName predicate:@"0"];
    [partnerLocation alignTrailingEdgeWithView:labelView predicate:@"0"];

    [labelView alignBottomEdgeWithView:partnerLocation predicate:@"0"];

    UIImageView *anchorImage = [[UIImageView alloc] init];
    anchorImage.contentMode = UIViewContentModeScaleAspectFit;
    [anchorImage setImage:[UIImage imageNamed:@"MapAnnotationCallout_Anchor"]];
    [self addSubview:anchorImage];
    [anchorImage constrainTopSpaceToView:container predicate:@"0"];
    [anchorImage alignLeadingEdgeWithView:self predicate:@"0"];
    [anchorImage alignTrailingEdgeWithView:self predicate:@"0"];
    [anchorImage constrainHeight:@"10"];

    [self alignBottomEdgeWithView:anchorImage predicate:@"10"];
    [self alignTrailingEdgeWithView:container predicate:@"0"];

    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapped:)];
    [container addGestureRecognizer:tap];

    _fair = fair;
    _mapView = mapView;
    return self;
}

- (void)setAnnotation:(ARFairMapAnnotation *)annotation
{
    _annotation = annotation;
    self.partnerName.text = annotation.title;
    self.partnerLocation.text = annotation.subTitle;
    self.position = annotation.point;

    id representedObject = self.annotation.representedObject;
    if ([representedObject isKindOfClass:PartnerShow.class]) {
        PartnerShow *partnerShow = (PartnerShow *)representedObject;
        self.partnerImage.hidden = NO;
        [self.partnerImage setImage:self.defaultPartnerImage];
        [self.partnerImage ar_setImageWithURL:[partnerShow imageURLWithFormatName:@"square"]];
        self.verticalSeparator.hidden = NO;
        self.arrowImage.hidden = NO;
    } else {
        self.partnerImage.hidden = YES;
        self.verticalSeparator.hidden = self.arrowImage.hidden = (annotation.href ? NO : YES);
    }

    [self updatePosition];
}

#pragma - Private helpers

- (void)updatePosition
{
    CGPoint point = [self.mapView zoomRelativePoint:self.position];
    CGFloat xPos = point.x - (self.frame.size.width / 2.0f);
    CGFloat yPos = point.y - (self.frame.size.height);
    self.frame = CGRectMake(floor(xPos), yPos, self.frame.size.width, self.frame.size.height);
}

- (void)tapped:(id)sender
{
    id representedObject = self.annotation.representedObject;
    UIViewController *controller = nil;
    if ([representedObject isKindOfClass:PartnerShow.class]) {
        PartnerShow *partnerShow = (PartnerShow *)representedObject;
        controller = [ARSwitchBoard.sharedInstance loadShow:partnerShow fair:self.fair];
    } else if (self.annotation.href) {
        controller = [ARSwitchBoard.sharedInstance loadPath:self.annotation.href];
    }

    if (controller) {
        [[ARTopMenuViewController sharedController] pushViewController:controller];
    }
}

@end
