// tslint:disable:no-var-requires
const fs = require("fs")
const cities = require("../src/lib/Scenes/City/cities")

const filename = "./Pod/Classes/Data/ARCity.m"

const citiesArray = cities.cityList.map(city => {
  const {
    name,
    epicenter: { lat, lng },
  } = city
  return `[[ARCity alloc] initWithName:@"${name}" epicenter:CLLocationCoordinate2DMake(${lat}, ${lng})]`
})

const contents = `
#import "ARCity.h"

static NSArray <ARCity *> *computedCities;

@interface ARCity ()

- (instancetype)initWithName:(NSString *)name epicenter:(CLLocationCoordinate2D)epicenter;

@end

@implementation ARCity

- (instancetype)initWithName:(NSString *)name epicenter:(CLLocationCoordinate2D)epicenter
{
    self = [super init];
    if (self) {
        _name = name;
        _epicenter = epicenter;
    }
    return self;
}

+ (NSArray <ARCity *> *)cities
{
    if (!computedCities) {
        computedCities = @[
            ${citiesArray.join(",\n            ")}
        ];
    }
    return computedCities;
}

@end
`
console.log("Generating Objective-C cities list...")
fs.writeFileSync(filename, contents)
console.log("Done.")
