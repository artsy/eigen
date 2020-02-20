#import "ARSwitchViewManager.h"

#import <Extraction/ARSwitchView.h>
#import <React/RCTComponent.h>
#import <FLKAutoLayout/FLKAutoLayout.h>


@interface ARSwitchViewComponent : UIView <ARSwitchViewDelegate>
@property (nonatomic, strong, readwrite) ARSwitchView *switchView;
@property (nonatomic, strong, readwrite) RCTDirectEventBlock onSelectionChange;
@end

@implementation ARSwitchViewComponent

- (instancetype)init;
{
    if ((self = [super init])) {
        
        // We are wrapping ARSwitchView within a UIView.
        // This is done to intercept React Native re-setting the background color on ARSwitchView directly.
        _switchView = [ARSwitchView new];
        [self addSubview:_switchView];
        _switchView.delegate = self;
        
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _switchView.frame = self.bounds;
}

- (void)setTitles:(NSArray *)titles;
{
    self.switchView.titles = titles;
}

- (void)setSelectedIndex:(NSInteger)selectedIndex;
{
    self.switchView.selectedIndex = selectedIndex;
}

- (void)switchView:(ARSwitchView *)_ didPressButtonAtIndex:(NSInteger)selectedIndex animated:(BOOL)animated;
{
    // Only animated changes are triggered by the user.
    if (animated) {
        self.onSelectionChange(@{ @"selectedIndex": @(selectedIndex) });
    }
}

@end

@implementation ARSwitchViewManager

RCT_EXPORT_MODULE();
RCT_EXPORT_VIEW_PROPERTY(titles, NSArray);
RCT_EXPORT_VIEW_PROPERTY(selectedIndex, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(onSelectionChange, RCTDirectEventBlock);

- (UIView *)view
{
    return [ARSwitchViewComponent new];
}

@end
