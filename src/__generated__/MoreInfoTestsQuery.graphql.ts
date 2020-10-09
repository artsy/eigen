/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fda7b5035d6c0e4097df2e314ee47753 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MoreInfoTestsQueryVariables = {};
export type MoreInfoTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"MoreInfo_show">;
    } | null;
};
export type MoreInfoTestsQueryRawResponse = {
    readonly show: ({
        readonly internalID: string;
        readonly slug: string;
        readonly pressReleaseUrl: string | null;
        readonly openingReceptionText: string | null;
        readonly partner: ({
            readonly __typename: "Partner";
            readonly __isNode: "Partner";
            readonly id: string;
            readonly website: string | null;
            readonly type: string | null;
        } | {
            readonly __typename: "ExternalPartner";
            readonly __isNode: "ExternalPartner";
            readonly id: string;
        } | {
            readonly __typename: string;
            readonly __isNode: string;
            readonly id: string;
        }) | null;
        readonly press_release: string | null;
        readonly events: ReadonlyArray<({
            readonly event_type: string | null;
            readonly description: string | null;
            readonly start_at: string | null;
            readonly end_at: string | null;
        }) | null> | null;
        readonly id: string;
    }) | null;
};
export type MoreInfoTestsQuery = {
    readonly response: MoreInfoTestsQueryResponse;
    readonly variables: MoreInfoTestsQueryVariables;
    readonly rawResponse: MoreInfoTestsQueryRawResponse;
};



/*
query MoreInfoTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
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
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MoreInfoTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MoreInfoTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
                "selections": (v2/*: any*/),
                "type": "Node",
                "abstractKey": "__isNode"
              },
              {
                "kind": "InlineFragment",
                "selections": (v2/*: any*/),
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
          (v1/*: any*/)
        ],
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
      }
    ]
  },
  "params": {
    "id": "fda7b5035d6c0e4097df2e314ee47753",
    "metadata": {},
    "name": "MoreInfoTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '95d9f9f6a8db4f48d036bacb751a5d77';
export default node;
