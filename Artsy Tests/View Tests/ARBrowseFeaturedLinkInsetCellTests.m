#import "ARBrowseFeaturedLinkInsetCell.h"
#import "FeaturedLink.h"

@interface ARBrowseFeaturedLinkInsetCell (Test)
@property (nonatomic, strong) UIImageView *overlayImageView;
- (void)setImageWithURL:(NSURL *)url;
@end

SpecBegin(ARBrowseFeaturedLinkInsetCell)

__block ARBrowseFeaturedLinkInsetCell *cell = nil;
__block id mockLink = [OCMockObject mockForClass:[FeaturedLink class]];

beforeEach(^{
    [[[mockLink stub] andReturn:@"http://example.com/image.jpg"] largeImageURL];
    
    cell = [[ARBrowseFeaturedLinkInsetCell alloc] init];
    cell.overlayImageView = nil;
});

context(@"errors", ^{
    it(@"does not set overlay if image is nil", ^{
        expect(cell.imageView.image).to.beNil;
        expect(cell.overlayImageView).to.beNil;

    });

    it(@"does not set overlay if request fails", ^{
        expect(cell.imageView.image).to.beNil;
        expect(cell.overlayImageView).to.beNil;

    });
});

context(@"success", ^{

    it(@"does not re-add overlay if one exists", ^{
        UIImageView *overlayImageView = [[UIImageView alloc] init];
        cell.overlayImageView = overlayImageView;
        [cell.contentView addSubview:cell.overlayImageView];

        NSInteger subviews = cell.contentView.subviews.count;

        [cell setImageWithURL:[mockLink largeImageURL]];
        expect(cell.contentView.subviews.count).to.equal(subviews + 0);
        expect(cell.overlayImageView).to.equal(overlayImageView);
    });

    context(@"no overlay exists", ^{
        __block NSInteger subviews = 0;
        before(^{
            [cell.contentView addSubview:cell.titleLabel];
            subviews = cell.contentView.subviews.count;
            [cell setImageWithURL:[mockLink largeImageURL]];
        });

        it(@"creates overlay view", ^{
            expect(cell.overlayImageView).notTo.beNil;
        });

        pending(@"adds overlay to subviews", ^{
            expect(cell.contentView.subviews.count).will.equal(subviews + 1);
            expect(cell.contentView.subviews).will.contain(cell.overlayImageView);
        });

        pending(@"places overlay below text", ^{
            NSInteger overlayIndex = [cell.contentView.subviews indexOfObject:cell.overlayImageView];
            NSInteger labelIndex = [cell.contentView.subviews indexOfObject:cell.titleLabel];
            expect(overlayIndex).to.equal(labelIndex - 1);
        });
    });
});

SpecEnd
