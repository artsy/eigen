/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0eb59dcbabef429d89f7edba3a46a704 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2MoreInfoTestsQueryVariables = {
    fairID: string;
};
export type Fair2MoreInfoTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2MoreInfo_fair">;
    } | null;
};
export type Fair2MoreInfoTestsQueryRawResponse = {
    readonly fair: ({
        readonly internalID: string;
        readonly slug: string;
        readonly about: string | null;
        readonly name: string | null;
        readonly tagline: string | null;
        readonly profile: ({
            readonly name: string | null;
            readonly id: string;
        }) | null;
        readonly location: ({
            readonly id: string;
            readonly internalID: string;
            readonly city: string | null;
            readonly address: string | null;
            readonly address_2: string | null;
            readonly postal_code: string | null;
            readonly summary: string | null;
            readonly coordinates: ({
                readonly lat: number | null;
                readonly lng: number | null;
            }) | null;
            readonly day_schedules: ReadonlyArray<({
                readonly start_time: number | null;
                readonly end_time: number | null;
                readonly day_of_week: string | null;
            }) | null> | null;
            readonly openingHours: ({
                readonly __typename: "OpeningHoursArray";
                readonly schedules: ReadonlyArray<({
                    readonly days: string | null;
                    readonly hours: string | null;
                }) | null> | null;
            } | {
                readonly __typename: "OpeningHoursText";
                readonly text: string | null;
            } | {
                readonly __typename: string;
            }) | null;
        }) | null;
        readonly sponsoredContent: ({
            readonly activationText: string | null;
            readonly pressReleaseUrl: string | null;
        }) | null;
        readonly ticketsLink: string | null;
        readonly fairHours: string | null;
        readonly fairLinks: string | null;
        readonly fairTickets: string | null;
        readonly summary: string | null;
        readonly fairContact: string | null;
        readonly id: string;
    }) | null;
};
export type Fair2MoreInfoTestsQuery = {
    readonly response: Fair2MoreInfoTestsQueryResponse;
    readonly variables: Fair2MoreInfoTestsQueryVariables;
    readonly rawResponse: Fair2MoreInfoTestsQueryRawResponse;
};



/*
query Fair2MoreInfoTestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...Fair2MoreInfo_fair
    id
  }
}

fragment Fair2MoreInfo_fair on Fair {
  internalID
  slug
  about
  name
  tagline
  profile {
    name
    id
  }
  location {
    ...LocationMap_location
    coordinates {
      lat
      lng
    }
    summary
    id
  }
  sponsoredContent {
    activationText
    pressReleaseUrl
  }
  ticketsLink
  fairHours: hours(format: MARKDOWN)
  fairLinks: links(format: MARKDOWN)
  fairTickets: tickets(format: MARKDOWN)
  summary
  fairContact: contact(format: MARKDOWN)
}

fragment LocationMap_location on Location {
  id
  internalID
  city
  address
  address_2: address2
  postal_code: postalCode
  summary
  coordinates {
    lat
    lng
  }
  day_schedules: daySchedules {
    start_time: startTime
    end_time: endTime
    day_of_week: dayOfWeek
  }
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
    "name": "fairID"
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Fair2MoreInfoTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Fair2MoreInfo_fair"
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
    "name": "Fair2MoreInfoTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
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
            "kind": "ScalarField",
            "name": "about",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "tagline",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Profile",
            "kind": "LinkedField",
            "name": "profile",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Location",
            "kind": "LinkedField",
            "name": "location",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "city",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "address",
                "storageKey": null
              },
              {
                "alias": "address_2",
                "args": null,
                "kind": "ScalarField",
                "name": "address2",
                "storageKey": null
              },
              {
                "alias": "postal_code",
                "args": null,
                "kind": "ScalarField",
                "name": "postalCode",
                "storageKey": null
              },
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "LatLng",
                "kind": "LinkedField",
                "name": "coordinates",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lat",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lng",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "day_schedules",
                "args": null,
                "concreteType": "DaySchedule",
                "kind": "LinkedField",
                "name": "daySchedules",
                "plural": true,
                "selections": [
                  {
                    "alias": "start_time",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startTime",
                    "storageKey": null
                  },
                  {
                    "alias": "end_time",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endTime",
                    "storageKey": null
                  },
                  {
                    "alias": "day_of_week",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "dayOfWeek",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
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
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "FairSponsoredContent",
            "kind": "LinkedField",
            "name": "sponsoredContent",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "activationText",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "pressReleaseUrl",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ticketsLink",
            "storageKey": null
          },
          {
            "alias": "fairHours",
            "args": (v6/*: any*/),
            "kind": "ScalarField",
            "name": "hours",
            "storageKey": "hours(format:\"MARKDOWN\")"
          },
          {
            "alias": "fairLinks",
            "args": (v6/*: any*/),
            "kind": "ScalarField",
            "name": "links",
            "storageKey": "links(format:\"MARKDOWN\")"
          },
          {
            "alias": "fairTickets",
            "args": (v6/*: any*/),
            "kind": "ScalarField",
            "name": "tickets",
            "storageKey": "tickets(format:\"MARKDOWN\")"
          },
          (v5/*: any*/),
          {
            "alias": "fairContact",
            "args": (v6/*: any*/),
            "kind": "ScalarField",
            "name": "contact",
            "storageKey": "contact(format:\"MARKDOWN\")"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0eb59dcbabef429d89f7edba3a46a704",
    "metadata": {},
    "name": "Fair2MoreInfoTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c75f58ca32cf8f91786e6fcab00ac7f8';
export default node;
