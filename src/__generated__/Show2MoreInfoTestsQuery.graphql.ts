/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c5ef3b96621788e80c45e788d5c92cb2 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2MoreInfoTestsQueryVariables = {
    showID: string;
};
export type Show2MoreInfoTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show2MoreInfo_show">;
    } | null;
};
export type Show2MoreInfoTestsQuery = {
    readonly response: Show2MoreInfoTestsQueryResponse;
    readonly variables: Show2MoreInfoTestsQueryVariables;
};



/*
query Show2MoreInfoTestsQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...Show2MoreInfo_show
    id
  }
}

fragment LocationMap_location on Location {
  id
  internalID
  city
  address
  address2
  postalCode
  summary
  coordinates {
    lat
    lng
  }
}

fragment PartnerEntityHeader_partner on Partner {
  ...PartnerFollowButton_partner
  href
  name
  cities
  isDefaultProfilePublic
  initials
  profile {
    icon {
      url(version: "square140")
    }
    id
  }
}

fragment PartnerFollowButton_partner on Partner {
  internalID
  slug
  profile {
    id
    internalID
    isFollowed
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

fragment Show2Location_show on Show {
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      id
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
  fair {
    name
    location {
      ...LocationMap_location
      id
    }
    id
  }
  location {
    ...LocationMap_location
    id
  }
}

fragment Show2MoreInfo_show on Show {
  ...Show2Location_show
  ...Show2Hours_show
  internalID
  slug
  href
  about: description
  pressRelease(format: MARKDOWN)
  partner {
    ...PartnerEntityHeader_partner
    __typename
    ... on Partner {
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
  fair {
    location {
      __typename
      openingHours {
        __typename
        ... on OpeningHoursArray {
          schedules {
            __typename
          }
        }
        ... on OpeningHoursText {
          text
        }
      }
      coordinates {
        lat
        lng
      }
      id
    }
    id
  }
  location {
    __typename
    openingHours {
      __typename
      ... on OpeningHoursArray {
        schedules {
          __typename
        }
      }
      ... on OpeningHoursText {
        text
      }
    }
    coordinates {
      lat
      lng
    }
    id
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
  "name": "__typename",
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
  "name": "internalID",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": [
    (v6/*: any*/),
    (v4/*: any*/),
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address2",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "postalCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "summary",
      "storageKey": null
    },
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
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "openingHours",
      "plural": false,
      "selections": [
        (v2/*: any*/),
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
                },
                (v2/*: any*/)
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
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v11 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Location"
},
v12 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v13 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "LatLng"
},
v14 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "OpeningHoursUnion"
},
v16 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "FormattedDaySchedules"
},
v17 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Show2MoreInfoTestsQuery",
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
            "name": "Show2MoreInfo_show"
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
    "name": "Show2MoreInfoTestsQuery",
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
            "concreteType": null,
            "kind": "LinkedField",
            "name": "partner",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Profile",
                    "kind": "LinkedField",
                    "name": "profile",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isFollowed",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "icon",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "square140"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"square140\")"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cities",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isDefaultProfilePublic",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "initials",
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
                "selections": [
                  (v3/*: any*/),
                  (v6/*: any*/)
                ],
                "type": "ExternalPartner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v6/*: any*/)
                ],
                "type": "Node",
                "abstractKey": "__isNode"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Fair",
            "kind": "LinkedField",
            "name": "fair",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v8/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/),
          (v6/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v7/*: any*/),
          {
            "alias": "about",
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "format",
                "value": "MARKDOWN"
              }
            ],
            "kind": "ScalarField",
            "name": "pressRelease",
            "storageKey": "pressRelease(format:\"MARKDOWN\")"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "c5ef3b96621788e80c45e788d5c92cb2",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "show": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Show"
        },
        "show.about": (v9/*: any*/),
        "show.fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "show.fair.id": (v10/*: any*/),
        "show.fair.location": (v11/*: any*/),
        "show.fair.location.__typename": (v12/*: any*/),
        "show.fair.location.address": (v9/*: any*/),
        "show.fair.location.address2": (v9/*: any*/),
        "show.fair.location.city": (v9/*: any*/),
        "show.fair.location.coordinates": (v13/*: any*/),
        "show.fair.location.coordinates.lat": (v14/*: any*/),
        "show.fair.location.coordinates.lng": (v14/*: any*/),
        "show.fair.location.id": (v10/*: any*/),
        "show.fair.location.internalID": (v10/*: any*/),
        "show.fair.location.openingHours": (v15/*: any*/),
        "show.fair.location.openingHours.__typename": (v12/*: any*/),
        "show.fair.location.openingHours.schedules": (v16/*: any*/),
        "show.fair.location.openingHours.schedules.__typename": (v12/*: any*/),
        "show.fair.location.openingHours.schedules.days": (v9/*: any*/),
        "show.fair.location.openingHours.schedules.hours": (v9/*: any*/),
        "show.fair.location.openingHours.text": (v9/*: any*/),
        "show.fair.location.postalCode": (v9/*: any*/),
        "show.fair.location.summary": (v9/*: any*/),
        "show.fair.name": (v9/*: any*/),
        "show.href": (v9/*: any*/),
        "show.id": (v10/*: any*/),
        "show.internalID": (v10/*: any*/),
        "show.location": (v11/*: any*/),
        "show.location.__typename": (v12/*: any*/),
        "show.location.address": (v9/*: any*/),
        "show.location.address2": (v9/*: any*/),
        "show.location.city": (v9/*: any*/),
        "show.location.coordinates": (v13/*: any*/),
        "show.location.coordinates.lat": (v14/*: any*/),
        "show.location.coordinates.lng": (v14/*: any*/),
        "show.location.id": (v10/*: any*/),
        "show.location.internalID": (v10/*: any*/),
        "show.location.openingHours": (v15/*: any*/),
        "show.location.openingHours.__typename": (v12/*: any*/),
        "show.location.openingHours.schedules": (v16/*: any*/),
        "show.location.openingHours.schedules.__typename": (v12/*: any*/),
        "show.location.openingHours.schedules.days": (v9/*: any*/),
        "show.location.openingHours.schedules.hours": (v9/*: any*/),
        "show.location.openingHours.text": (v9/*: any*/),
        "show.location.postalCode": (v9/*: any*/),
        "show.location.summary": (v9/*: any*/),
        "show.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "PartnerTypes"
        },
        "show.partner.__isNode": (v12/*: any*/),
        "show.partner.__typename": (v12/*: any*/),
        "show.partner.cities": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "String"
        },
        "show.partner.href": (v9/*: any*/),
        "show.partner.id": (v10/*: any*/),
        "show.partner.initials": (v9/*: any*/),
        "show.partner.internalID": (v10/*: any*/),
        "show.partner.isDefaultProfilePublic": (v17/*: any*/),
        "show.partner.name": (v9/*: any*/),
        "show.partner.profile": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Profile"
        },
        "show.partner.profile.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "show.partner.profile.icon.url": (v9/*: any*/),
        "show.partner.profile.id": (v10/*: any*/),
        "show.partner.profile.internalID": (v10/*: any*/),
        "show.partner.profile.isFollowed": (v17/*: any*/),
        "show.partner.slug": (v10/*: any*/),
        "show.partner.type": (v9/*: any*/),
        "show.pressRelease": (v9/*: any*/),
        "show.slug": (v10/*: any*/)
      }
    },
    "name": "Show2MoreInfoTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '0cf47ddd45705861c2a85ab21e58bcfd';
export default node;
