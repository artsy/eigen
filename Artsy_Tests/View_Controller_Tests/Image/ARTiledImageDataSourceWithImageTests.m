#import "UIImage+ImageFromColor.h"
#import "ARTiledImageDataSourceWithImage.h"

SpecBegin(ARTiledImageDataSourceWithImage);

describe(@"init", ^{

    __block Image *image = nil;
    __block ARTiledImageDataSourceWithImage *dataSource = nil;

    beforeEach(^{
        image = [Image modelWithJSON:@{
            @"id": @"image-id",
            @"max_tiled_height": @(2376),
            @"max_tiled_width": @(4224),
            @"tile_size" : @(233),
            @"tile_base_url" : @"http://static0.artsy.net/maps/map-id/level/dztiles-512-0"
        }];
        dataSource = [[ARTiledImageDataSourceWithImage alloc] initWithImage:image];
    });

    it(@"check for image existing", ^{
        expect(dataSource.image).to.equal(image);
    });

    context(@"delegate methods", ^{

        it(@"gives the right tile size", ^{
            CGSize tileSize = [dataSource tileSizeForImageView:nil];
            expect(tileSize.width).to.equal(image.tileSize);
            expect(tileSize.height).to.equal(image.tileSize);
        });

        it(@"gives the right image size", ^{
            CGSize imageSize = [dataSource imageSizeForImageView:nil];
            expect(imageSize.width).to.equal(image.maxTiledWidth);
            expect(imageSize.height).to.equal(image.maxTiledHeight);
        });

        it(@"gives the right minimum zoom level", ^{
            expect([dataSource minimumImageZoomLevelForImageView:nil]).to.equal(11);
        });

        it(@"gives the right maximum zoom level", ^{
            expect([dataSource maximumImageZoomLevelForImageView:nil]).to.equal(13);
        });

        it(@"stores and retrieves a tile", ^{
            UIImage *uiImage = [UIImage imageFromColor:[UIColor whiteColor]];
            NSURL * url = [NSURL URLWithString:@"http://static0.artsy.net/maps/map-id/level/dztiles-512-0/11/1_0.jpg"];
            [dataSource tiledImageView:nil didDownloadTiledImage:uiImage atURL:url];
            UIImage *loadedImage = [dataSource tiledImageView:nil imageTileForLevel:11 x:1 y:0];
            expect(loadedImage).toNot.beNil();
            expect(loadedImage).to.beKindOf([UIImage class]);
        });
    });

});

SpecEnd;
