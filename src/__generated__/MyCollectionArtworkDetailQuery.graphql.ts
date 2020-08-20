/* tslint:disable */
/* eslint-disable */
/* @relayHash 6bf6efca2c9bb15fac5e5f2fc297553f */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionArtworkDetailQueryVariables = {
    artworkID: string;
};
export type MyCollectionArtworkDetailQueryResponse = {
    readonly artwork: {
        readonly id: string;
        readonly artistNames: string | null;
        readonly medium: string | null;
    } | null;
};
export type MyCollectionArtworkDetailQuery = {
    readonly response: MyCollectionArtworkDetailQueryResponse;
    readonly variables: MyCollectionArtworkDetailQueryVariables;
};



/*
query MyCollectionArtworkDetailQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    id
    artistNames
    medium
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artworkID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "artwork",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "artworkID"
      }
    ],
    "concreteType": "Artwork",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "artistNames",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "medium",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkDetailQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkDetailQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkDetailQuery",
    "id": "a91a95ab8971f11506d7010ae6b38e58",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'e569f51c903540c913627ad49f2ae0c7';
export default node;
