/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type createMockNetworkLayerTestsAliasQueryVariables = {};
export type createMockNetworkLayerTestsAliasQueryResponse = {
    readonly artist: ({
        readonly forSaleArtworks: ReadonlyArray<({
            readonly id: string;
        }) | null> | null;
        readonly notForSaleArtworks: ReadonlyArray<({
            readonly id: string;
        }) | null> | null;
    }) | null;
};
export type createMockNetworkLayerTestsAliasQuery = {
    readonly response: createMockNetworkLayerTestsAliasQueryResponse;
    readonly variables: createMockNetworkLayerTestsAliasQueryVariables;
};



/*
query createMockNetworkLayerTestsAliasQuery {
  artist(id: "banksy") {
    forSaleArtworks: artworks(filter: IS_FOR_SALE) {
      id
      __id: id
    }
    notForSaleArtworks: artworks(filter: IS_NOT_FOR_SALE) {
      id
      __id: id
    }
    __id: id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
  v0
],
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "artist",
    "storageKey": "artist(id:\"banksy\")",
    "args": [
      {
        "kind": "Literal",
        "name": "id",
        "value": "banksy",
        "type": "String!"
      }
    ],
    "concreteType": "Artist",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "forSaleArtworks",
        "name": "artworks",
        "storageKey": "artworks(filter:\"IS_FOR_SALE\")",
        "args": [
          {
            "kind": "Literal",
            "name": "filter",
            "value": "IS_FOR_SALE",
            "type": "[ArtistArtworksFilters]"
          }
        ],
        "concreteType": "Artwork",
        "plural": true,
        "selections": v1
      },
      {
        "kind": "LinkedField",
        "alias": "notForSaleArtworks",
        "name": "artworks",
        "storageKey": "artworks(filter:\"IS_NOT_FOR_SALE\")",
        "args": [
          {
            "kind": "Literal",
            "name": "filter",
            "value": "IS_NOT_FOR_SALE",
            "type": "[ArtistArtworksFilters]"
          }
        ],
        "concreteType": "Artwork",
        "plural": true,
        "selections": v1
      },
      v0
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "createMockNetworkLayerTestsAliasQuery",
  "id": null,
  "text": "query createMockNetworkLayerTestsAliasQuery {\n  artist(id: \"banksy\") {\n    forSaleArtworks: artworks(filter: IS_FOR_SALE) {\n      id\n      __id: id\n    }\n    notForSaleArtworks: artworks(filter: IS_NOT_FOR_SALE) {\n      id\n      __id: id\n    }\n    __id: id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "createMockNetworkLayerTestsAliasQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v2
  },
  "operation": {
    "kind": "Operation",
    "name": "createMockNetworkLayerTestsAliasQuery",
    "argumentDefinitions": [],
    "selections": v2
  }
};
})();
(node as any).hash = 'd71064778be9a9526b5a559c23006b2c';
export default node;
