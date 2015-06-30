#import "ARCrossfadingImageView.h"

typedef NS_ENUM(NSInteger, ARDirection) {
    ARUp = 1,
    ARDown = -1
};

@interface ARCrossfadingImageView()
@property (nonatomic) UIImageView *topView;
@property (nonatomic) ARDirection dir;
@end

@implementation ARCrossfadingImageView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _topView = [[UIImageView alloc] initWithFrame:self.bounds];
        _currentIndex = NSNotFound;
        self.contentMode = UIViewContentModeScaleAspectFill;
        [self insertSubview:_topView atIndex:0];
    }
    return self;
}

- (void)setFrame:(CGRect)frame
{
    [super setFrame:frame];
    _topView.frame = self.bounds;
}

- (void)setBounds:(CGRect)bounds
{
    [super setBounds:bounds];
    _topView.frame = bounds;
}

- (void)setImages:(NSArray *)images
{
    _images = images;
    self.currentIndex = 0;
    self.dir = ARUp;

}

- (void)setDir:(ARDirection)dir
{
    if (_dir == dir) {
        return;
    }
    _dir = dir;
    [self setTop];
}

- (void)setTop
{
    switch (self.dir){
        case ARUp:
            if (self.currentIndex == self.images.count - 1) {
                if (self.shouldLoopImages) {
                    self.topView.image = [self.images firstObject];
                } else {
                    self.topView.image = nil;
                }
            } else {
                self.topView.image = self.images[self.currentIndex + 1];
            }
            break;
        case ARDown:
            if (self.currentIndex == 0) {
                if (self.shouldLoopImages) {
                    self.topView.image = [self.images lastObject];
                } else {
                    self.topView.image = nil;
                }
            } else {
                self.topView.image = self.images[self.currentIndex - 1];
            }
    }
}

- (void)setCurrentIndex:(NSInteger)currentIndex
{
    NSInteger imageCount = self.images.count;
    if (currentIndex == self.currentIndex || imageCount == 0) {
        return;
    }
    if (currentIndex < 0 || currentIndex >= imageCount) {
        ARErrorLog(@"Index %@ out of bounds in crossfading image view %@ with %@ images",
                                                        @(currentIndex), self, @(imageCount));
        return;
    }
    _currentIndex = currentIndex;

    self.image = self.images[_currentIndex];
    self.topView.alpha = 0;
    [self setTop];
}

- (void)setContentMode:(UIViewContentMode)contentMode
{
    [super setContentMode:contentMode];
    [_topView setContentMode:contentMode];
}

- (void)up:(CGFloat)t
{
    if (!self.shouldLoopImages && self.currentIndex == self.images.count - 1) {
        return;
    }
    self.dir = ARUp;
    t = fmaxf(fminf(1.f, t), 0.f);
    self.topView.alpha = t;
}

- (void)down:(CGFloat)t
{
    if (!self.shouldLoopImages && self.currentIndex == 0) {
        return;
    }
    self.dir = ARDown;
    t = fmaxf(fminf(1.f, t), 0.f);
    self.topView.alpha = t;
}

@end
