/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 472196dd4778c5c10158b014f69275ca */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RequestConditionReportQueryVariables = {
    artworkID: string;
};
export type RequestConditionReportQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"RequestConditionReport_me">;
    } | null;
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"RequestConditionReport_artwork">;
    } | null;
};
export type RequestConditionReportQuery = {
    readonly response: RequestConditionReportQueryResponse;
    readonly variables: RequestConditionReportQueryVariables;
};



/*
query RequestConditionReportQuery(
  $artworkID: String!
) {
  me {
    ...RequestConditionReport_me
    id
  }
  artwork(id: $artworkID) {
    ...RequestConditionReport_artwork
    id
  }
}

fragment RequestConditionReport_artwork on Artwork {
  internalID
  slug
  saleArtwork {
    internalID
    id
  }
}

fragment RequestConditionReport_me on Me {
  email
  internalID
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artworkID"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RequestConditionReportQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RequestConditionReport_me"
          }
        ],
        "storageKey": null
      },
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
            "name": "RequestConditionReport_artwork"
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
    "name": "RequestConditionReportQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "SaleArtwork",
            "kind": "LinkedField",
            "name": "saleArtwork",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "472196dd4778c5c10158b014f69275ca",
    "metadata": {},
    "name": "RequestConditionReportQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '0d2ee5d88aac80c1d2e6a2b1fd592924';
export default node;
