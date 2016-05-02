#import "ARFairPopupViewController.h"
@import SDWebImage;

SpecBegin(ARFairPopupViewController);

__block ARFairPopupViewController *sut;

describe(@"visuals", ^{
    it(@"looks right", ^{
        NSURL *imageURL = [NSURL URLWithString:@"https://background.image/thing.jpg"];
        UIImage *image = [UIImage imageFromColor:[UIColor artsyPurpleRegular]];
        [[SDWebImageManager sharedManager] saveImageToCache:image forURL:imageURL];

        sut = [[ARFairPopupViewController alloc] initWithFairTitle:@"Test Title" imageBackgroundURL:imageURL slug:@"slug"];
        expect(sut).to.haveValidSnapshot();
    });
});

SpecEnd;
