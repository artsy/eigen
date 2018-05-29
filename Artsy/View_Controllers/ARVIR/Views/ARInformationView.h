#import <UIKit/UIKit.h>


@interface InformationalViewState : NSObject
@property (nonatomic, copy, nonnull) NSString *xOutOfYMessage;
@property (nonatomic, copy, nonnull) NSString *bodyString;
@property (nonatomic, strong, nonnull) UIView *contents;
@property (nonatomic, copy, nullable) void (^onStart)(UIView * _Nonnull customView);

@end

@interface ARInformationView : UIView

- (void)setupWithStates:(NSArray<InformationalViewState *> *_Nonnull)states;

- (void)next;
- (void)nextAnimated:(BOOL)animated;

- (InformationalViewState * _Nonnull)currentState;
@end
