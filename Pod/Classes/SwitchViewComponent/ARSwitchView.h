#import <UIKit/UIKit.h>


@class ARSwitchView;

@protocol ARSwitchViewDelegate <NSObject>
- (void)switchView:(ARSwitchView *)switchView didPressButtonAtIndex:(NSInteger)buttonIndex animated:(BOOL)animated;
@end


@interface ARSwitchView : UIView

- (instancetype)initWithFrame:(CGRect)frame NS_UNAVAILABLE;
- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

- (instancetype)initWithButtonTitles:(NSArray *)titles NS_DESIGNATED_INITIALIZER;
- (void)setTitle:(NSString *)title forButtonAtIndex:(NSInteger)index;

@property (nonatomic, weak, readwrite) id<ARSwitchViewDelegate> delegate;
@property (nonatomic, strong, readonly) NSArray<UIButton *> *buttons;

// Assigning to this replaces all existing buttons with new ones.
@property (nonatomic, strong, readwrite) NSArray<NSString *> *titles;

/// Use highlighting instead of disabling the button
@property (nonatomic, assign, readwrite) BOOL preferHighlighting;

@property (nonatomic, strong) NSArray *enabledStates;
- (void)setEnabledStates:(NSArray *)enabledStates animated:(BOOL)animated;

@property (nonatomic, assign, readwrite) NSInteger selectedIndex;
- (void)setSelectedIndex:(NSInteger)index animated:(BOOL)animated;

@end
