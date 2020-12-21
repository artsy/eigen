/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d37b5a37025ecddb9ffbcd851c9027ab */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkMediumQueryVariables = {
    id: string;
};
export type ArtworkMediumQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"ArtworkMedium_artwork">;
    } | null;
};
export type ArtworkMediumQuery = {
    readonly response: ArtworkMediumQueryResponse;
    readonly variables: ArtworkMediumQueryVariables;
};



/*
query ArtworkMediumQuery(
  $id: String!
) {
  artwork(id: $id) {
    ...ArtworkMedium_artwork
    id
  }
}

fragment ArtworkMedium_artwork on Artwork {
  mediumType {
    name
    longDescription
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkMediumQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtworkMedium_artwork"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtworkMediumQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkMedium",
            "kind": "LinkedField",
            "name": "mediumType",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "longDescription",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d37b5a37025ecddb9ffbcd851c9027ab",
    "metadata": {},
    "name": "ArtworkMediumQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ed4bda445a7b162d073cacb37ccb2e80';
export default node;
