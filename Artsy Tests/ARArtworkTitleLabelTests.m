//
//  ARArtworkTitleLabelTests.m
//  Artsy
//
//  Created by Laura Brown on 3/31/15.
//  Copyright (c) 2015 Artsy. All rights reserved.
//

#import "ARCustomEigenLabels.h"

SpecBegin(ARArtworkTitleLabel)

__block ARArtworkTitleLabel *titleLabel;

before(^{
    titleLabel = [[ARArtworkTitleLabel alloc] init];
});

it(@"formats title and date", ^{
    [titleLabel setTitle:@"Title" date:@"2014"];
    expect(titleLabel.text).to.equal(@"Title, 2014");
});

it(@"formats title and nil date", ^{
    [titleLabel setTitle:@"Title" date:nil];
    expect(titleLabel.text).to.equal(@"Title");
});

it(@"formats title and emptystring date", ^{
    [titleLabel setTitle:@"Title" date:@""];
    expect(titleLabel.text).to.equal(@"Title");
});

it(@"formats date and nil title", ^{
    [titleLabel setTitle:nil date:@"2014"];
    expect(titleLabel.text).to.equal(@"2014");
});

it(@"formats date and emptystring title", ^{
    [titleLabel setTitle:@"" date:@"2014"];
    expect(titleLabel.text).to.equal(@"2014");
});

it(@"is empty string with nil title and date", ^{
    [titleLabel setTitle:nil date:nil];
    expect(titleLabel.text).to.equal(@"");
});

it(@"is emptystring with emptystring title", ^{
    [titleLabel setTitle:@"" date:@""];
    expect(titleLabel.text).to.equal(@"");
});

SpecEnd
