/* tslint:disable */
/* eslint-disable */
/* @relayHash 7baa811fccffb4f8430954349ccc2a99 */

import { ConcreteRequest } from "relay-runtime";
export type ViewingRoomArtworkQueryVariables = {
    viewingRoomID: string;
};
export type ViewingRoomArtworkQueryResponse = {
    readonly viewingRoom: {
        readonly title: string;
    } | null;
};
export type ViewingRoomArtworkQuery = {
    readonly response: ViewingRoomArtworkQueryResponse;
    readonly variables: ViewingRoomArtworkQueryVariables;
};



/*
query ViewingRoomArtworkQuery(
  $viewingRoomID: ID!
) {
  viewingRoom(id: $viewingRoomID) {
    title
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "viewingRoomID",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "viewingRoom",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "viewingRoomID"
      }
    ],
    "concreteType": "ViewingRoom",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "title",
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
    "name": "ViewingRoomArtworkQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomArtworkQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "ViewingRoomArtworkQuery",
    "id": "1c3c5dd8742553a75665a3f67e768197",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '43cbc19b7043d2da5829cecf5b8e6e54';
export default node;
