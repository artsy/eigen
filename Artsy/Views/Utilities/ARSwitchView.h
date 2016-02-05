#import <UIKit/UIKit.h>


@class ARSwitchView;

@protocol ARSwitchViewDelegate <NSObject>
- (void)switchView:(ARSwitchView *)switchView didPressButtonAtIndex:(NSInteger)buttonIndex animated:(BOOL)animated;
@end


@interface ARSwitchView : UIView

- (instancetype)initWithButtonTitles:(NSArray *)buttonTitlesArray;
- (void)setTitle:(NSString *)title forButtonAtIndex:(NSInteger)index;

@property (nonatomic, weak, readwrite) id<ARSwitchViewDelegate> delegate;
@property (nonatomic, strong, readonly) NSArray *buttons;

/// Use highlighting instead of disabling the button
@property (nonatomic, assign, readwrite) BOOL preferHighlighting;

@property (nonatomic, strong) NSArray *enabledStates;
- (void)setEnabledStates:(NSArray *)enabledStates animated:(BOOL)animated;

@property (nonatomic, assign, readwrite) NSInteger selectedIndex;
- (void)setSelectedIndex:(NSInteger)index animated:(BOOL)animated;

@end
