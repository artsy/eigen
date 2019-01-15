/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { GlobalMap_viewer$ref } from "./GlobalMap_viewer.graphql";
export type Near = {
    readonly lat: number;
    readonly lng: number;
    readonly max_distance?: number | null;
};
export type MapRendererQueryVariables = {
    readonly near: Near;
};
export type MapRendererQueryResponse = {
    readonly viewer: ({
        readonly " $fragmentRefs": GlobalMap_viewer$ref;
    }) | null;
};
export type MapRendererQuery = {
    readonly response: MapRendererQueryResponse;
    readonly variables: MapRendererQueryVariables;
};



/*
query MapRendererQuery(
  $near: Near!
) {
  viewer {
    ...GlobalMap_viewer_279V1T
  }
}

fragment GlobalMap_viewer_279V1T on Viewer {
  shows: partner_shows(near: $near) {
    id
    name
    __id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "near",
    "type": "Near!",
    "defaultValue": null
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "MapRendererQuery",
  "id": "98382631341054cb502834a1c6b4d64c",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "MapRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "viewer",
        "name": "__viewer_viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "GlobalMap_viewer",
            "args": [
              {
                "kind": "Variable",
                "name": "near",
                "variableName": "near",
                "type": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MapRendererQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "shows",
            "name": "partner_shows",
            "storageKey": null,
            "args": [
              {
                "kind": "Variable",
                "name": "near",
                "variableName": "near",
                "type": "Near"
              }
            ],
            "concreteType": "PartnerShow",
            "plural": true,
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
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__id",
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
        "name": "viewer",
        "args": null,
        "handle": "viewer",
        "key": "",
        "filters": null
      }
    ]
  }
};
})();
(node as any).hash = 'a924837874386dd66ef68c243edd0a54';
export default node;
