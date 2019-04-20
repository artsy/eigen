/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type createMockNetworkLayerTestsAliasQueryVariables = {};
export type createMockNetworkLayerTestsAliasQueryResponse = {
    readonly artist: ({
        readonly forSaleArtworks: ReadonlyArray<({
            readonly __id: string;
        }) | null> | null;
        readonly notForSaleArtworks: ReadonlyArray<({
            readonly __id: string;
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
      __id
    }
    notForSaleArtworks: artworks(filter: IS_NOT_FOR_SALE) {
      __id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "__id",
    "args": null,
    "storageKey": null
  }
],
v1 = [
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
        "selections": (v0/*: any*/)
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
        "selections": (v0/*: any*/)
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "createMockNetworkLayerTestsAliasQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "createMockNetworkLayerTestsAliasQuery",
    "argumentDefinitions": [],
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "createMockNetworkLayerTestsAliasQuery",
    "id": "1ce5538ad3920f602a6189085cc702ed",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '1ce5538ad3920f602a6189085cc702ed';
export default node;
