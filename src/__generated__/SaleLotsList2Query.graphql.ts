/* tslint:disable */
/* eslint-disable */
/* @relayHash c7270b39b10ed7d3885ecd1a35beff2d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList2QueryVariables = {
    count: number;
    cursor?: string | null;
};
export type SaleLotsList2QueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList2_saleArtworksConnection">;
};
export type SaleLotsList2QueryRawResponse = {
    readonly saleArtworksConnection: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly title: string | null;
                readonly id: string | null;
                readonly __typename: "Artwork";
            }) | null;
            readonly cursor: string | null;
            readonly id: string | null;
        }) | null> | null;
        readonly totalCount: number | null;
        readonly pageInfo: {
            readonly endCursor: string | null;
            readonly hasNextPage: boolean;
        };
    }) | null;
};
export type SaleLotsList2Query = {
    readonly response: SaleLotsList2QueryResponse;
    readonly variables: SaleLotsList2QueryVariables;
    readonly rawResponse: SaleLotsList2QueryRawResponse;
};



/*
query SaleLotsList2Query(
  $count: Int!
  $cursor: String
) {
  ...SaleLotsList2_saleArtworksConnection_1G22uz
}

fragment SaleLotsList2_saleArtworksConnection_1G22uz on Query {
  saleArtworksConnection(first: $count, after: $cursor) {
    edges {
      node {
        title
        id
        __typename
      }
      cursor
      id
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleLotsList2Query",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "SaleLotsList2_saleArtworksConnection",
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleLotsList2Query",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "saleArtworksConnection",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SaleArtworksConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleArtwork",
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "title",
                    "args": null,
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "__typename",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "cursor",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "totalCount",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "pageInfo",
            "storageKey": null,
            "args": null,
            "concreteType": "PageInfo",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "endCursor",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "hasNextPage",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      },
      {
        "kind": "LinkedHandle",
        "alias": null,
        "name": "saleArtworksConnection",
        "args": (v1/*: any*/),
        "handle": "connection",
        "key": "SaleLotsList2_saleArtworksConnection",
        "filters": null
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SaleLotsList2Query",
    "id": "63ab8807f748d53c9be859d055422012",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b3ba4c9a6b71a7b56095b5dbd492849e';
export default node;
