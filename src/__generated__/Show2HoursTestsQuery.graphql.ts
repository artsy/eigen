/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 21d594d051bec4d80410900460cda305 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2HoursTestsQueryVariables = {
    showID: string;
};
export type Show2HoursTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show2Hours_show">;
    } | null;
};
export type Show2HoursTestsQuery = {
    readonly response: Show2HoursTestsQueryResponse;
    readonly variables: Show2HoursTestsQueryVariables;
};



/*
query Show2HoursTestsQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...Show2Hours_show
    id
  }
}

fragment Show2Hours_show on Show {
  id
  location {
    ...Show2LocationHours_location
    id
  }
  fair {
    location {
      ...Show2LocationHours_location
      id
    }
    id
  }
}

fragment Show2LocationHours_location on Location {
  openingHours {
    __typename
    ... on OpeningHoursArray {
      schedules {
        days
        hours
      }
    }
    ... on OpeningHoursText {
      text
    }
  }
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
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "openingHours",
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
              "concreteType": "FormattedDaySchedules",
              "kind": "LinkedField",
              "name": "schedules",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "days",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "hours",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "type": "OpeningHoursArray",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "text",
              "storageKey": null
            }
          ],
          "type": "OpeningHoursText",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    (v2/*: any*/)
  ],
  "storageKey": null
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v5 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Location"
},
v6 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "OpeningHoursUnion"
},
v7 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "FormattedDaySchedules"
},
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Show2HoursTestsQuery",
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
            "name": "Show2Hours_show"
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
    "name": "Show2HoursTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Fair",
            "kind": "LinkedField",
            "name": "fair",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "21d594d051bec4d80410900460cda305",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "show": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Show"
        },
        "show.fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "show.fair.id": (v4/*: any*/),
        "show.fair.location": (v5/*: any*/),
        "show.fair.location.id": (v4/*: any*/),
        "show.fair.location.openingHours": (v6/*: any*/),
        "show.fair.location.openingHours.__typename": (v7/*: any*/),
        "show.fair.location.openingHours.schedules": (v8/*: any*/),
        "show.fair.location.openingHours.schedules.days": (v9/*: any*/),
        "show.fair.location.openingHours.schedules.hours": (v9/*: any*/),
        "show.fair.location.openingHours.text": (v9/*: any*/),
        "show.id": (v4/*: any*/),
        "show.location": (v5/*: any*/),
        "show.location.id": (v4/*: any*/),
        "show.location.openingHours": (v6/*: any*/),
        "show.location.openingHours.__typename": (v7/*: any*/),
        "show.location.openingHours.schedules": (v8/*: any*/),
        "show.location.openingHours.schedules.days": (v9/*: any*/),
        "show.location.openingHours.schedules.hours": (v9/*: any*/),
        "show.location.openingHours.text": (v9/*: any*/)
      }
    },
    "name": "Show2HoursTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b136e6e99e4696b2ff4c88451786e558';
export default node;
