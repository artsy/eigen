#import <UIKit/UIKit.h>

@class ARSearchFieldButton;

@protocol ARSearchFieldButtonDelegate <NSObject>

- (void)searchFieldButtonWasPressed:(ARSearchFieldButton *)sender;

@end

@interface ARSearchFieldButton : UIView

@property (nonatomic, weak) id<ARSearchFieldButtonDelegate> delegate;

@end
