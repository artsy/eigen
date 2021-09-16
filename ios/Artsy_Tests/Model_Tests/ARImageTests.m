#import "Image.h"

SpecBegin(Image);

__block Image *image;

beforeEach(^{
    image = [Image modelWithJSON:@{
        @"id": @"image-id",
        @"max_tiled_width": @(400),
        @"max_tiled_height": @(400),
        @"tile_size" : @(233),
        @"tile_base_url" : @"http://static0.artsy.net/maps/map-id/level/dztiles-512-0",
        @"image_url": @"http://image.example/:version.jpg",
        @"image_versions": @[@"tall", @"large"]
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

describe(@"versions", ^{
    it(@"returns a URL for the requested version", ^{
        expect([image imageURLWithFormatName:@"tall"]).to.equal([NSURL URLWithString:@"http://image.example/tall.jpg"]);
    });
    
    it(@"returns a URL for the next higher version if the requested version does not exist", ^{
        expect([image imageURLWithFormatName:@"medium"]).to.equal([NSURL URLWithString:@"http://image.example/tall.jpg"]);
    });
    
    it(@"returns a URL for the next lower version if the requested version does not exist", ^{
        expect([image imageURLWithFormatName:@"larger"]).to.equal([NSURL URLWithString:@"http://image.example/large.jpg"]);
    });
});

SpecEnd;
