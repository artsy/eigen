/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type createMockNetworkLayerTestsAliasQueryVariables = {};
export type createMockNetworkLayerTestsAliasQueryResponse = {
    readonly artist: {
        readonly forSaleArtworks: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                } | null;
            } | null> | null;
        } | null;
        readonly notForSaleArtworks: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type createMockNetworkLayerTestsAliasQuery = {
    readonly response: createMockNetworkLayerTestsAliasQueryResponse;
    readonly variables: createMockNetworkLayerTestsAliasQueryVariables;
};



/*
query createMockNetworkLayerTestsAliasQuery {
  artist(id: "banksy") {
    forSaleArtworks: artworksConnection(filter: IS_FOR_SALE) {
      edges {
        node {
          id
        }
      }
    }
    notForSaleArtworks: artworksConnection(filter: IS_NOT_FOR_SALE) {
      edges {
        node {
          id
        }
      }
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
    "value": "banksy"
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
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "edges",
    "storageKey": null,
    "args": null,
    "concreteType": "ArtworkEdge",
    "plural": true,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": null,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ]
      }
    ]
  }
],
v3 = {
  "kind": "LinkedField",
  "alias": "forSaleArtworks",
  "name": "artworksConnection",
  "storageKey": "artworksConnection(filter:\"IS_FOR_SALE\")",
  "args": [
    {
      "kind": "Literal",
      "name": "filter",
      "value": "IS_FOR_SALE"
    }
  ],
  "concreteType": "ArtworkConnection",
  "plural": false,
  "selections": (v2/*: any*/)
},
v4 = {
  "kind": "LinkedField",
  "alias": "notForSaleArtworks",
  "name": "artworksConnection",
  "storageKey": "artworksConnection(filter:\"IS_NOT_FOR_SALE\")",
  "args": [
    {
      "kind": "Literal",
      "name": "filter",
      "value": "IS_NOT_FOR_SALE"
    }
  ],
  "concreteType": "ArtworkConnection",
  "plural": false,
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
    "id": "f5ef215bce437df51c4fb3e13abae0e5",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b02bf9fa416501b4198a21a849e2d25f';
export default node;
