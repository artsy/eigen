#import "ARAspectRatioImageView.h"
#import "UIImage+ImageFromColor.h"

SpecBegin(ARAspectRatioImageView);

__block ARAspectRatioImageView *view = nil;

describe(@"intrinsicContentSize", ^{

    describe(@"without an image", ^{
        beforeEach(^{
            view = [[ARAspectRatioImageView alloc] init];
        });

        it(@"returns no metric", ^{
            CGSize size = (CGSize) { UIViewNoIntrinsicMetric, UIViewNoIntrinsicMetric };
            expect([view intrinsicContentSize]).to.equal(size);
        });
    });

    describe(@"with an image", ^{
        beforeEach(^{
            view = [[ARAspectRatioImageView alloc] initWithFrame:CGRectMake(0, 0, 1, 2)];
            view.image = [UIImage imageFromColor:[UIColor whiteColor]]; // 1x1 px
        });

        it(@"returns image size", ^{
            CGSize size = CGSizeMake(1, 1);
            expect([view intrinsicContentSize]).to.equal(size);
        });
    });

});

SpecEnd;
