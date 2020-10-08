/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0fff943ed4b8ee4a4856b40c701c5e40 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MoreInfoQueryVariables = {
    showID: string;
};
export type MoreInfoQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"MoreInfo_show">;
    } | null;
};
export type MoreInfoQuery = {
    readonly response: MoreInfoQueryResponse;
    readonly variables: MoreInfoQueryVariables;
};



/*
query MoreInfoQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...MoreInfo_show
    id
  }
}

fragment MoreInfo_show on Show {
  internalID
  slug
  pressReleaseUrl
  openingReceptionText
  partner {
    __typename
    ... on Partner {
      website
      type
    }
    ... on Node {
      __isNode: __typename
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  press_release: pressRelease
  events {
    ...ShowEventSection_event
  }
}

fragment ShowEventSection_event on ShowEventType {
  event_type: eventType
  description
  start_at: startAt
  end_at: endAt
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "showID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "showID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v2/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MoreInfoQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MoreInfo_show"
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
    "name": "MoreInfoQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
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
            "kind": "ScalarField",
            "name": "pressReleaseUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "openingReceptionText",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "partner",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "website",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  }
                ],
                "type": "Partner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v3/*: any*/),
                "type": "Node",
                "abstractKey": "__isNode"
              },
              {
                "kind": "InlineFragment",
                "selections": (v3/*: any*/),
                "type": "ExternalPartner",
                "abstractKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": "press_release",
            "args": null,
            "kind": "ScalarField",
            "name": "pressRelease",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ShowEventType",
            "kind": "LinkedField",
            "name": "events",
            "plural": true,
            "selections": [
              {
                "alias": "event_type",
                "args": null,
                "kind": "ScalarField",
                "name": "eventType",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": "start_at",
                "args": null,
                "kind": "ScalarField",
                "name": "startAt",
                "storageKey": null
              },
              {
                "alias": "end_at",
                "args": null,
                "kind": "ScalarField",
                "name": "endAt",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0fff943ed4b8ee4a4856b40c701c5e40",
    "metadata": {},
    "name": "MoreInfoQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '845de9834db6c6e92fc0337a28679c20';
export default node;
