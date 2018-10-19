#import "AROptions.h"

SpecBegin(AROption);

it(@"does not include options which aren't set to true or false in +labOptionsMap", ^{
    NSUserDefaults *standardDefaults = [NSUserDefaults standardUserDefaults];
    [standardDefaults setBool:YES forKey:@"aroptions_custom_obj"];

    // We've set this
    expect([AROptions optionExists:@"aroptions_custom_obj"]).to.equal(YES);
    // And verifies that this option isn't in there
    expect([AROptions optionExists:@"aroptions_custom_obj_not_set"]).to.equal(NO);
});

SpecEnd
