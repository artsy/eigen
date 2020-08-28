/* tslint:disable */
/* eslint-disable */
/* @relayHash 6fbd2a807db400db12ba4e35afd93ab1 */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionArtworkDetailQueryVariables = {
    artworkID: string;
};
export type MyCollectionArtworkDetailQueryResponse = {
    readonly artwork: {
        readonly internalID: string;
        readonly id: string;
        readonly artistNames: string | null;
        readonly artist: {
            readonly internalID: string;
        } | null;
        readonly medium: string | null;
        readonly title: string | null;
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
    internalID
    id
    artistNames
    artist {
      internalID
      id
    }
    medium
    title
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
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "medium",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkDetailQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ]
          },
          (v5/*: any*/),
          (v6/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkDetailQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          },
          (v5/*: any*/),
          (v6/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkDetailQuery",
    "id": "bb0b63d87fec00a68c809ff5bc689323",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '108789bcf8c7c4b479b01a44b4c6e61e';
export default node;
