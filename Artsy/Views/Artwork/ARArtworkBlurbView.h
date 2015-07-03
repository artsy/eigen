#import <ORStackView/ORStackView.h>

@class ARArtworkBlurbView;

@protocol ARArtworkBlurbViewDelegate <NSObject>

- (void)artworkBlurView:(ARArtworkBlurbView *)blurbView shouldPresentViewController:(UIViewController *)viewController;

@end


@interface ARArtworkBlurbView : ORStackView

- (instancetype)initWithArtwork:(Artwork *)artwork;

@property (nonatomic, weak) id<ARArtworkBlurbViewDelegate> delegate;

@end
