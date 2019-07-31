/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { MoreInfo_show$ref } from "./MoreInfo_show.graphql";
export type MoreInfoQueryVariables = {
    readonly showID: string;
};
export type MoreInfoQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": MoreInfo_show$ref;
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
  exhibition_period: exhibitionPeriod
  pressReleaseUrl
  openingReceptionText
  partner {
    __typename
    ... on Partner {
      website
      type
    }
    ... on Node {
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
    "kind": "LocalArgument",
    "name": "showID",
    "type": "String!",
    "defaultValue": null
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
    "name": "MoreInfoQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MoreInfo_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MoreInfoQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "exhibition_period",
            "name": "exhibitionPeriod",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "pressReleaseUrl",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "openingReceptionText",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "website",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "type",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": "press_release",
            "name": "pressRelease",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "events",
            "storageKey": null,
            "args": null,
            "concreteType": "ShowEventType",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": "event_type",
                "name": "eventType",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "description",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "start_at",
                "name": "startAt",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "end_at",
                "name": "endAt",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MoreInfoQuery",
    "id": "c1ba96606665df6d8db595bd4f9db631",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '845de9834db6c6e92fc0337a28679c20';
export default node;
