#import <UIKit/UIKit.h>


@interface InformationalViewState : NSObject
@property (nonatomic, copy, nonnull) NSString *xOutOfYMessage;
@property (nonatomic, copy, nonnull) NSString *bodyString;
@property (nonatomic, strong, nonnull) UIView *contents;
@property (nonatomic, copy, nullable) NSString *stateTag;
@property (nonatomic, copy, nullable) void (^onStart)(UIView * _Nonnull customView);
@property (nonatomic, assign) BOOL animate;
@end

/**
  Basically an animating stack of three views, which is controlled by providing a set of
 InformationalViewState objects.
 */
@interface ARInformationView : UIView

- (void)setupWithStates:(NSArray<InformationalViewState *> *_Nonnull)states;

- (void)reset;

/** Animates by default */
- (void)next;
- (void)nextAnimated:(BOOL)animated;

/** So that you can get access to the contents view of the current state */
- (InformationalViewState * _Nonnull)currentState;

/** Are we in the final state? */
- (BOOL)isAtLastState;
@end
