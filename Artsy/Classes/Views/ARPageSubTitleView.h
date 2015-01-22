/// A simple title view for content

@interface ARPageSubTitleView : UIView

/// Designated init, sets the title, uses autolayout
- (instancetype)initWithTitle:(NSString *)title;

/// Alternative init function that allows passing in the frame
- (instancetype)initWithTitle:(NSString *)title andFrame:(CGRect)frame;

/// Change the text on the subtitle
@property (nonatomic, copy) NSString *title;

@end
