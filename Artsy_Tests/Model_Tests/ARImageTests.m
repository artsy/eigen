#import "Image.h"

SpecBegin(Image);

__block Image *image;

beforeEach(^{
    image = [Image modelWithJSON:@{
        @"id": @"image-id",
        @"max_tiled_width": @(400),
        @"max_tiled_height": @(400),
        @"tile_size" : @(233),
        @"tile_base_url" : @"http://static0.artsy.net/maps/map-id/level/dztiles-512-0"
    }];
});

describe(@"canZoom", ^{
    it(@"returns true if max tiled dimensions are at least size of target frame", ^{
        expect([image canZoom:CGSizeMake(200, 200)]).to.beTruthy();
        expect([image canZoom:CGSizeMake(image.maxTiledWidth, image.maxTiledHeight)]).to.beTruthy();
    });
    it(@"returns false if max width or height is smaller than frame's", ^{
        expect([image canZoom:CGSizeMake(500, image.maxTiledHeight)]).to.beFalsy();
        expect([image canZoom:CGSizeMake(image.maxTiledWidth, 500)]).to.beFalsy();
        expect([image canZoom:CGSizeMake(500, 500)]).to.beFalsy();
    });
});

SpecEnd;
