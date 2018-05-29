#import "ARWhitespaceGobbler.h"
#import "ARInformationView.h"

#import <FLKAutoLayout/FLKAutoLayout.h>
#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>
#import <ORStackView/ORStackView.h>

@implementation InformationalViewState
@end

@interface ARInformationView()
@property (nonatomic, assign) NSInteger index;
@property (nonatomic, strong) NSArray<InformationalViewState *> *states;
@property (nonatomic, weak) ORStackView *stack;
@end

@implementation ARInformationView

- (void)setupWithStates:(NSArray<InformationalViewState *> *)states
{
    _states = states;
    _index = -1;

    ORStackView *stack = [[ORStackView alloc] init];
    stack.bottomMarginHeight = 40;

    [self addSubview:stack];
    [stack alignTop:@"0" bottom:@"0" toView:self];
    [stack alignLeading:@"20" trailing:@"-20" toView:self];
    _stack = stack;

    self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];

    [self nextAnimated:NO];
}

- (void)next
{
    [self nextAnimated:YES];
}

- (InformationalViewState *)currentState
{
    return self.states[self.index];
}

- (void)nextAnimated:(BOOL)animate
{
    // ignore animated right now
    [self.stack removeAllSubviews];

    // Bump the index and repeat if it's past the top
    self.index++;
    if (self.index > self.states.count) {
        self.index = 0;
    }

    InformationalViewState *state = self.states[self.index];

    UILabel *xOfYLabel = [[UILabel alloc] init];
    xOfYLabel.font = [UIFont displayMediumSansSerifFontWithSize:10];
    xOfYLabel.text = state.xOutOfYMessage;
    xOfYLabel.textAlignment = NSTextAlignmentCenter;
    xOfYLabel.textColor = [UIColor whiteColor];
    [self.stack addSubview:xOfYLabel withTopMargin:@"10" sideMargin:@"0"];

    UILabel *messageLabel = [[UILabel alloc] init];
    messageLabel.font = [UIFont serifFontWithSize:16];
    messageLabel.text = state.bodyString;
    messageLabel.textColor = [UIColor whiteColor];
    messageLabel.numberOfLines = 0;
    [self.stack addSubview:messageLabel withTopMargin:@"10" sideMargin:@"0"];

    // Basically a flexible space grabber which forces the state.contenst
    // to align with the bottom instead of from the top
    ARWhitespaceGobbler *gap = [[ARWhitespaceGobbler alloc] init];
    [self.stack addSubview:gap withTopMargin:@"0" sideMargin:@"0"];

    [self.stack addSubview:state.contents withTopMargin:@"0" sideMargin:@"0"];
    if (state.onStart) {
        state.onStart(state.contents);
    }
}

@end
