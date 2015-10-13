#import "ARPostFeedItemLinkView.h"

#import "ARPostFeedItem.h"
#import "ARAspectRatioImageView.h"
#import "Profile.h"
#import "ARSeparatorViews.h"
#import "ARTheme.h"


@implementation ARPostFeedItemLinkView

- (id)initWithPostFeedItem:(ARPostFeedItem *)postFeedItem
{
    self = [super init];
    if (!self) {
        return nil;
    }

    [self addTarget:nil action:@selector(tappedPostFeedItemLinkView:) forControlEvents:UIControlEventTouchUpInside];

    ARSeparatorView *separatorView = [[ARSeparatorView alloc] init];
    [self addSubview:separatorView];

    ARAspectRatioImageView *imageView = [[ARAspectRatioImageView alloc] init];
    [self addSubview:imageView];

    UIView *imageFiller = [[UIView alloc] init];
    imageFiller.userInteractionEnabled = NO;
    [self addSubview:imageFiller];

    UIView *labelContainer = [[UIView alloc] init];
    labelContainer.userInteractionEnabled = NO;
    [self addSubview:labelContainer];

    UIView *labelFiller = [[UIView alloc] init];
    labelFiller.userInteractionEnabled = NO;
    [self addSubview:labelFiller];

    UILabel *postTitleLabel = [ARThemedFactory labelForFeedItemHeaders];
    postTitleLabel.font = [postTitleLabel.font fontWithSize:20];
    [postTitleLabel setText:[postFeedItem title] withLineHeight:1.5];
    [labelContainer addSubview:postTitleLabel];

    [separatorView alignLeading:@"10" trailing:@"-10" toView:self];
    [separatorView alignBottomEdgeWithView:self predicate:@"0"];

    [imageView constrainWidth:@"120"];
    [imageView alignLeadingEdgeWithView:self predicate:@"10"];
    [imageView alignTopEdgeWithView:self predicate:@"20"];

    [imageFiller constrainTopSpaceToView:imageView predicate:@"0"];

    [labelContainer constrainLeadingSpaceToView:imageView predicate:@"20"];
    [labelContainer alignTopEdgeWithView:imageView predicate:@"0"];
    [labelContainer alignTrailingEdgeWithView:self predicate:@"-10"];

    [postTitleLabel alignTopEdgeWithView:labelContainer predicate:@"0"];

    if (postFeedItem.profile.profileName) {
        UILabel *postAuthorLabel = [ARThemedFactory labelForLinkItemSubtitles];
        postAuthorLabel.text = [postFeedItem.profile.profileName uppercaseString];

        [labelContainer addSubview:postAuthorLabel];

        [postAuthorLabel constrainTopSpaceToView:postTitleLabel predicate:@"5"];
        [labelContainer alignBottomEdgeWithView:postAuthorLabel predicate:@"0"];
        [UIView alignLeadingAndTrailingEdgesOfViews:@[ postTitleLabel, postAuthorLabel, labelContainer ]];
    } else {
        [UIView alignLeadingAndTrailingEdgesOfViews:@[ postTitleLabel, labelContainer ]];
        [labelContainer alignBottomEdgeWithView:postTitleLabel predicate:@"0"];
    };
    [UIView alignLeadingAndTrailingEdgesOfViews:@[ labelFiller, labelContainer ]];
    [labelFiller constrainTopSpaceToView:labelContainer predicate:@"0"];

    [self alignBottomEdgeWithView:labelFiller predicate:@"21"];
    [self alignBottomEdgeWithView:imageFiller predicate:@"21"];

    _targetPath = NSStringWithFormat(@"/post/%@", postFeedItem.postID);

    NSURL *imageUrl = [NSURL URLWithString:postFeedItem.imageURL];
    [imageView ar_setImageWithURL:imageUrl completed:(SDWebImageCompletionBlock) ^ {
        [self setNeedsLayout];
        [self layoutIfNeeded];
    }];

    return self;
}

@end
