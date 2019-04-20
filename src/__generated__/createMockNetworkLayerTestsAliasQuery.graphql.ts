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
    }
    notForSaleArtworks: artworks(filter: IS_NOT_FOR_SALE) {
      id
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "banksy",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
],
v3 = {
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
  "selections": (v2/*: any*/)
},
v4 = {
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
  "selections": (v2/*: any*/)
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "createMockNetworkLayerTestsAliasQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"banksy\")",
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "createMockNetworkLayerTestsAliasQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"banksy\")",
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "createMockNetworkLayerTestsAliasQuery",
    "id": "d71064778be9a9526b5a559c23006b2c",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'd71064778be9a9526b5a559c23006b2c';
export default node;
