/* tslint:disable */
/* eslint-disable */
/* @relayHash fa9d592e80b578096a30f23c95174359 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2TestsQueryVariables = {};
export type Fair2TestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
    } | null;
};
export type Fair2TestsQueryRawResponse = {
    readonly fair: ({
        readonly about: string | null;
        readonly summary: string | null;
        readonly name: string | null;
        readonly slug: string;
        readonly profile: ({
            readonly icon: ({
                readonly url: string | null;
            }) | null;
            readonly id: string | null;
        }) | null;
        readonly image: ({
            readonly url: string | null;
            readonly aspectRatio: number;
        }) | null;
        readonly tagline: string | null;
        readonly location: ({
            readonly summary: string | null;
            readonly id: string | null;
        }) | null;
        readonly ticketsLink: string | null;
        readonly hours: string | null;
        readonly links: string | null;
        readonly tickets: string | null;
        readonly contact: string | null;
        readonly id: string | null;
    }) | null;
};
export type Fair2TestsQuery = {
    readonly response: Fair2TestsQueryResponse;
    readonly variables: Fair2TestsQueryVariables;
    readonly rawResponse: Fair2TestsQueryRawResponse;
};



/*
query Fair2TestsQuery {
  fair(id: "art-basel-hong-kong-2020") {
    ...Fair2_fair
    id
  }
}

fragment Fair2Header_fair on Fair {
  about
  summary
  name
  slug
  profile {
    icon {
      url
    }
    id
  }
  image {
    url
    aspectRatio
  }
  tagline
  location {
    summary
    id
  }
  ticketsLink
  hours(format: HTML)
  links(format: HTML)
  tickets(format: HTML)
  contact(format: HTML)
}

fragment Fair2_fair on Fair {
  ...Fair2Header_fair
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "art-basel-hong-kong-2020"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "summary",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
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
    "value": "HTML"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Fair2TestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"art-basel-hong-kong-2020\")",
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Fair2_fair",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "Fair2TestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"art-basel-hong-kong-2020\")",
        "args": (v0/*: any*/),
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
          (v1/*: any*/),
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
            "kind": "LinkedField",
            "alias": null,
            "name": "profile",
            "storageKey": null,
            "args": null,
            "concreteType": "Profile",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "icon",
                "storageKey": null,
                "args": null,
                "concreteType": "Image",
                "plural": false,
                "selections": [
                  (v2/*: any*/)
                ]
              },
              (v3/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "image",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "aspectRatio",
                "args": null,
                "storageKey": null
              }
            ]
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
              (v1/*: any*/),
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
            "storageKey": "hours(format:\"HTML\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "links",
            "args": (v4/*: any*/),
            "storageKey": "links(format:\"HTML\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "tickets",
            "args": (v4/*: any*/),
            "storageKey": "tickets(format:\"HTML\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "contact",
            "args": (v4/*: any*/),
            "storageKey": "contact(format:\"HTML\")"
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "Fair2TestsQuery",
    "id": "068de196276bec886e010b51c579c3c3",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'e5156a8f14d2ec6351eb5c4b9cef85d6';
export default node;
