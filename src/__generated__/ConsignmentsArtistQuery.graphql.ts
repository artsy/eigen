/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type ConsignmentsArtistQueryVariables = {
    readonly query: string;
};
export type ConsignmentsArtistQueryResponse = {
    readonly matchArtist: ReadonlyArray<{
        readonly internalID: string;
        readonly name: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
    } | null> | null;
};
export type ConsignmentsArtistQuery = {
    readonly response: ConsignmentsArtistQueryResponse;
    readonly variables: ConsignmentsArtistQueryVariables;
};



/*
query ConsignmentsArtistQuery(
  $query: String!
) {
  matchArtist(term: $query) {
    internalID
    name
    image {
      url
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "query",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "term",
    "variableName": "query"
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "url",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConsignmentsArtistQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "matchArtist",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ConsignmentsArtistQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "matchArtist",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ConsignmentsArtistQuery",
    "id": "ed29b8a51936a49b1a3d981f5d084c6e",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cb27fca9152591c6a9fbb6102a70418d';
export default node;
