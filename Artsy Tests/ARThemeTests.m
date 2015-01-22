#import "ARTheme.h"

SpecBegin(ARTheme)

it(@"automatically loads defaultTheme", ^{
    expect([ARTheme defaultTheme]).toNot.beNil();
    expect([ARTheme defaultTheme]).to.beKindOf([ARTheme class]);
});

it(@"loads fonts", ^{
    expect([ARTheme defaultTheme].fonts).notTo.beNil();
});

it(@"loads colors", ^{
    expect([ARTheme defaultTheme].colors).notTo.beNil();
});

it(@"loads layout", ^{
    expect([ARTheme defaultTheme].layout).notTo.beNil();
});

SpecEnd