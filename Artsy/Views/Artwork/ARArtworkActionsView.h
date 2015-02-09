// Shows contact buttons, or buy buttons, or edition prices, etc

#import <ORStackView/ORStackView.h>
@class ARArtworkActionsView;

@protocol ARArtworkActionsViewDelegate <NSObject>
- (void)didUpdateArtworkActionsView:(ARArtworkActionsView *)actionsView;
@end

@interface ARArtworkActionsView : ORStackView
- (instancetype)initWithArtwork:(Artwork *)artwork;
@property (nonatomic, assign) BOOL enabled;
@property (nonatomic, weak) id<ARArtworkActionsViewDelegate> delegate;
@end


