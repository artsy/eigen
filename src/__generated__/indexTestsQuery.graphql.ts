/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Show_show$ref } from "./Show_show.graphql";
export type indexTestsQueryVariables = {};
export type indexTestsQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": Show_show$ref;
    }) | null;
};
export type indexTestsQuery = {
    readonly response: indexTestsQueryResponse;
    readonly variables: indexTestsQueryVariables;
};



/*
query indexTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...Show_show
    __id
  }
}

fragment Show_show on Show {
  ...ShowHeader_show
  id
  location {
    __id
    id
    city
    address
    address_2
    coordinates {
      lat
      lng
    }
    day_schedules {
      start_time
      end_time
      day_of_week
    }
  }
  artists {
    __id
    id
    name
    is_followed
  }
  artworks {
    __id
    id
    artist_names
    image {
      id
      url
    }
    price
    availability
    contact_label
  }
  counts {
    artworks
    eligible_artworks
  }
  partner {
    __typename
    ... on ExternalPartner {
      name
      __id
    }
    ... on Partner {
      name
    }
    ... on Node {
      __id
    }
  }
  __id
}

fragment ShowHeader_show on Show {
  name
  description
  press_release
  exhibition_period
  status
  images {
    url
    aspect_ratio
  }
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = [
  v2
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "indexTestsQuery",
  "id": null,
  "text": "query indexTestsQuery {\n  show(id: \"anderson-fine-art-gallery-flickinger-collection\") {\n    ...Show_show\n    __id\n  }\n}\n\nfragment Show_show on Show {\n  ...ShowHeader_show\n  id\n  location {\n    __id\n    id\n    city\n    address\n    address_2\n    coordinates {\n      lat\n      lng\n    }\n    day_schedules {\n      start_time\n      end_time\n      day_of_week\n    }\n  }\n  artists {\n    __id\n    id\n    name\n    is_followed\n  }\n  artworks {\n    __id\n    id\n    artist_names\n    image {\n      id\n      url\n    }\n    price\n    availability\n    contact_label\n  }\n  counts {\n    artworks\n    eligible_artworks\n  }\n  partner {\n    __typename\n    ... on ExternalPartner {\n      name\n      __id\n    }\n    ... on Partner {\n      name\n    }\n    ... on Node {\n      __id\n    }\n  }\n  __id\n}\n\nfragment ShowHeader_show on Show {\n  name\n  description\n  press_release\n  exhibition_period\n  status\n  images {\n    url\n    aspect_ratio\n  }\n  __id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "indexTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Show_show",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "indexTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          v1,
          v2,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "press_release",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "exhibition_period",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "status",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              v3,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "aspect_ratio",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
          v4,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              v1,
              v4,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "city",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "address",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "address_2",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "coordinates",
                "storageKey": null,
                "args": null,
                "concreteType": "coordinates",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lat",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lng",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "day_schedules",
                "storageKey": null,
                "args": null,
                "concreteType": "DaySchedule",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "start_time",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "end_time",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "day_of_week",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              v1,
              v4,
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_followed",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworks",
            "storageKey": null,
            "args": null,
            "concreteType": "Artwork",
            "plural": true,
            "selections": [
              v1,
              v4,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artist_names",
                "args": null,
                "storageKey": null
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
                  v4,
                  v3
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "price",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "availability",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "contact_label",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "ShowCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artworks",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "eligible_artworks",
                "args": null,
                "storageKey": null
              }
            ]
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
              v1,
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": v5
              },
              {
                "kind": "InlineFragment",
                "type": "ExternalPartner",
                "selections": v5
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '3e2c9eb71446a9653f129ea9d755a483';
export default node;
