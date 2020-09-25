/* tslint:disable */
/* eslint-disable */
/* @relayHash 403a186d4db96cdf9812f6e767f9dc43 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2MoreInfoQueryVariables = {
    fairID: string;
};
export type Fair2MoreInfoQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2MoreInfo_fair">;
    } | null;
};
export type Fair2MoreInfoQuery = {
    readonly response: Fair2MoreInfoQueryResponse;
    readonly variables: Fair2MoreInfoQueryVariables;
};



/*
query Fair2MoreInfoQuery(
  $fairID: String!
) {
  fair(id: $fairID) @principalField {
    ...Fair2MoreInfo_fair
    id
  }
}

fragment Fair2MoreInfo_fair on Fair {
  about
  name
  slug
  tagline
  location {
    summary
    id
  }
  ticketsLink
  hours(format: MARKDOWN)
  links(format: MARKDOWN)
  tickets(format: MARKDOWN)
  summary
  contact(format: MARKDOWN)
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "fairID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "summary",
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
v4 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Fair2MoreInfoQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Fair2MoreInfo_fair",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "Fair2MoreInfoQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "about",
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
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "tagline",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "ticketsLink",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "hours",
            "args": (v4/*: any*/),
            "storageKey": "hours(format:\"MARKDOWN\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "links",
            "args": (v4/*: any*/),
            "storageKey": "links(format:\"MARKDOWN\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "tickets",
            "args": (v4/*: any*/),
            "storageKey": "tickets(format:\"MARKDOWN\")"
          },
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "contact",
            "args": (v4/*: any*/),
            "storageKey": "contact(format:\"MARKDOWN\")"
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "Fair2MoreInfoQuery",
    "id": "5093169439cf0d7d60fe685be9e02742",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c0b78e780c064aed6d48946928a2bcb0';
export default node;
