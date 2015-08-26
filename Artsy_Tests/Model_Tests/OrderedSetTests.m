SpecBegin(OrderedSet);

afterEach(^{
    [OHHTTPStubs removeAllStubs];
});

it(@"initialize", ^{
    OrderedSet *orderedSet = [OrderedSet modelFromDictionary:@{ @"orderedSetID" : @"set-id" }];
    expect(orderedSet.orderedSetID).to.equal(@"set-id");
});

it(@"getItems(FeaturedLink)", ^{
    OrderedSet *orderedSet = [OrderedSet modelFromDictionary:@{ @"orderedSetID" : @"set-id", @"itemType" : @"FeaturedLink" }];

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/set-id/items" withResponse:@[
        @{ @"id": @"one", @"href": @"/post/moby-my-highlights-from-art-los-angeles-contemporary", @"title" : @"Moby" },
        @{ @"id": @"two", @"href": @"/post/iris_marden-my-highlights-from-art-los-angeles-contemporary", @"title" : @"Iris Marden" },
    ]];

    __block NSArray * _orderedSetItems = nil;
    [orderedSet getItems:^(NSArray *items) {
        _orderedSetItems = items;
    }];

    expect(_orderedSetItems).willNot.beNil();
    expect(_orderedSetItems.count).to.equal(2);
    expect(_orderedSetItems.firstObject).to.beKindOf([FeaturedLink class]);

    FeaturedLink *first = _orderedSetItems[0];
    expect(first).toNot.beNil();
    expect(first.title).to.equal(@"Moby");
    expect(first.href).to.equal(@"/post/moby-my-highlights-from-art-los-angeles-contemporary");
});

it(@"getItems(Sale)", ^{
    OrderedSet *orderedSet = [OrderedSet modelFromDictionary:@{ @"orderedSetID" : @"set-id", @"itemType" : @"Sale" }];

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/set/set-id/items" withResponse:@[
        @{ @"id": @"frieze-london-sale-2013", @"name": @"Frieze London Sale 2013" }
    ]];

    __block NSArray * _orderedSetItems = nil;
    [orderedSet getItems:^(NSArray *items) {
        _orderedSetItems = items;
    }];

    expect(_orderedSetItems).willNot.beNil();
    expect(_orderedSetItems.count).to.equal(1);
    expect(_orderedSetItems.firstObject).to.beKindOf([Sale class]);

    Sale *first = _orderedSetItems[0];
    expect(first).toNot.beNil();
    expect(first.saleID).to.equal(@"frieze-london-sale-2013");
    expect(first.name).to.equal(@"Frieze London Sale 2013");
});

it(@"getItems raises an exception when retrieving items of an unsupported time", ^{
    OrderedSet *orderedSet = [OrderedSet modelFromDictionary:@{ @"orderedSetID" : @"set-id", @"itemType" : @"Invalid" }];
    expect(^{
        [orderedSet getItems:nil];
    }).to.raiseWithReason(@"NSInternalInconsistencyException", @"Unsupported item type: Invalid");
});

SpecEnd;
