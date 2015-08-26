#import "ARDefaults.h"

SpecBegin(ARDefaults);

it(@"rests user defaults", ^{
    [[NSUserDefaults standardUserDefaults] setValue:@1 forKey:@"Test Value"];
    expect([[NSUserDefaults standardUserDefaults] valueForKey:@"Test Value"]).to.equal(@1);
    [ARDefaults resetDefaults];
    expect([[NSUserDefaults standardUserDefaults] valueForKey:@"Test Value"]).to.beNil();
});

SpecEnd;
