#import "ARFeedStatusIndicatorTableViewCell.h"
#import "ARReusableLoadingView.h"
#import "ARNetworkErrorView.h"


@interface ARFeedStatusIndicatorTableViewCell ()
@property (nonatomic, weak) UIView *stateView;
@end


@implementation ARFeedStatusIndicatorTableViewCell

+ (CGFloat)heightForFeedItemWithState:(ARFeedStatusState)state
{
    switch (state) {
        case ARFeedStatusStateEndOfFeed:
            return 80;
        case ARFeedStatusStateLoading:
            return 60;
        case ARFeedStatusStateNetworkError:
            return 60;
        default:
            return 0;
    }
}

+ (instancetype)cellWithInitialState:(ARFeedStatusState)state
{
    ARFeedStatusIndicatorTableViewCell *cell = nil;
    cell = [[ARFeedStatusIndicatorTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"FeedStatus"];
    cell.selectedBackgroundView = nil;
    cell.state = state;
    cell.userInteractionEnabled = NO;
    return cell;
}

- (void)setState:(ARFeedStatusState)state
{
    if (state != _state) {
        [self.stateView removeFromSuperview];
        UIView *stateView = nil;

        switch (state) {
            case ARFeedStatusStateLoading:
                stateView = [[ARReusableLoadingView alloc] initWithFrame:self.contentView.bounds];
                [(ARReusableLoadingView *)stateView startIndeterminateAnimated:YES];
                stateView.backgroundColor = [UIColor whiteColor];
                break;

            case ARFeedStatusStateEndOfFeed:
                stateView = [[UIView alloc] initWithFrame:self.contentView.bounds];
                stateView.backgroundColor = [UIColor blackColor];
                break;

            case ARFeedStatusStateNetworkError:
                stateView = [[ARNetworkErrorView alloc] initWithFrame:self.contentView.bounds];
                break;
        }

        stateView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        [self.contentView addSubview:stateView];

        self.stateView = stateView;
        _state = state;
    }
}

@end
