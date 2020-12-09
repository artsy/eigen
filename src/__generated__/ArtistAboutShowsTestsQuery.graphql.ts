/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7577822d85a8a9401515c5976318898a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistAboutShowsTestsQueryVariables = {
    artistID: string;
};
export type ArtistAboutShowsTestsQueryResponse = {
    readonly artist: {
        readonly currentShows: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                } | null;
            } | null> | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"ArtistAboutShows_artist">;
    } | null;
};
export type ArtistAboutShowsTestsQuery = {
    readonly response: ArtistAboutShowsTestsQueryResponse;
    readonly variables: ArtistAboutShowsTestsQueryVariables;
};



/*
query ArtistAboutShowsTestsQuery(
  $artistID: String!
) {
  artist(id: $artistID) {
    ...ArtistAboutShows_artist
    currentShows: showsConnection(status: "running", first: 10) {
      edges {
        node {
          id
        }
      }
    }
    id
  }
}

fragment ArtistAboutShows_artist on Artist {
  currentShows: showsConnection(status: "running", first: 10) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
  upcomingShows: showsConnection(status: "upcoming", first: 10) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
  pastShows: showsConnection(status: "closed", first: 3) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
}

fragment ArtistShow_show on Show {
  slug
  href
  is_fair_booth: isFairBooth
  cover_image: coverImage {
    url(version: "large")
  }
  ...Metadata_show
}

fragment Metadata_show on Show {
  kind
  name
  exhibition_period: exhibitionPeriod
  status_update: statusUpdate
  status
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
  location {
    city
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artistID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
],
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v3 = [
  (v2/*: any*/),
  {
    "kind": "Literal",
    "name": "status",
    "value": "running"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ShowEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v4/*: any*/),
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
            "name": "href",
            "storageKey": null
          },
          {
            "alias": "is_fair_booth",
            "args": null,
            "kind": "ScalarField",
            "name": "isFairBooth",
            "storageKey": null
          },
          {
            "alias": "cover_image",
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "version",
                    "value": "large"
                  }
                ],
                "kind": "ScalarField",
                "name": "url",
                "storageKey": "url(version:\"large\")"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "kind",
            "storageKey": null
          },
          (v6/*: any*/),
          {
            "alias": "exhibition_period",
            "args": null,
            "kind": "ScalarField",
            "name": "exhibitionPeriod",
            "storageKey": null
          },
          {
            "alias": "status_update",
            "args": null,
            "kind": "ScalarField",
            "name": "statusUpdate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
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
                  (v6/*: any*/)
                ],
                "type": "Partner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v6/*: any*/),
                  (v4/*: any*/)
                ],
                "type": "ExternalPartner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v5/*: any*/),
                "type": "Node",
                "abstractKey": "__isNode"
              }
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "city",
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ShowConnection"
},
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "ShowEdge"
},
v10 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Show"
},
v11 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v12 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v13 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v14 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Location"
},
v16 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "PartnerTypes"
},
v17 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistAboutShowsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": "currentShows",
            "args": (v3/*: any*/),
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ShowEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Show",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "showsConnection(first:10,status:\"running\")"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistAboutShows_artist"
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
    "name": "ArtistAboutShowsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": "currentShows",
            "args": (v3/*: any*/),
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"running\")"
          },
          {
            "alias": "upcomingShows",
            "args": [
              (v2/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "upcoming"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"upcoming\")"
          },
          {
            "alias": "pastShows",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
              },
              {
                "kind": "Literal",
                "name": "status",
                "value": "closed"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": "showsConnection(first:3,status:\"closed\")"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "7577822d85a8a9401515c5976318898a",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "artist.currentShows": (v8/*: any*/),
        "artist.currentShows.edges": (v9/*: any*/),
        "artist.currentShows.edges.node": (v10/*: any*/),
        "artist.currentShows.edges.node.cover_image": (v11/*: any*/),
        "artist.currentShows.edges.node.cover_image.url": (v12/*: any*/),
        "artist.currentShows.edges.node.exhibition_period": (v12/*: any*/),
        "artist.currentShows.edges.node.href": (v12/*: any*/),
        "artist.currentShows.edges.node.id": (v13/*: any*/),
        "artist.currentShows.edges.node.is_fair_booth": (v14/*: any*/),
        "artist.currentShows.edges.node.kind": (v12/*: any*/),
        "artist.currentShows.edges.node.location": (v15/*: any*/),
        "artist.currentShows.edges.node.location.city": (v12/*: any*/),
        "artist.currentShows.edges.node.location.id": (v13/*: any*/),
        "artist.currentShows.edges.node.name": (v12/*: any*/),
        "artist.currentShows.edges.node.partner": (v16/*: any*/),
        "artist.currentShows.edges.node.partner.__isNode": (v17/*: any*/),
        "artist.currentShows.edges.node.partner.__typename": (v17/*: any*/),
        "artist.currentShows.edges.node.partner.id": (v13/*: any*/),
        "artist.currentShows.edges.node.partner.name": (v12/*: any*/),
        "artist.currentShows.edges.node.slug": (v13/*: any*/),
        "artist.currentShows.edges.node.status": (v12/*: any*/),
        "artist.currentShows.edges.node.status_update": (v12/*: any*/),
        "artist.id": (v13/*: any*/),
        "artist.pastShows": (v8/*: any*/),
        "artist.pastShows.edges": (v9/*: any*/),
        "artist.pastShows.edges.node": (v10/*: any*/),
        "artist.pastShows.edges.node.cover_image": (v11/*: any*/),
        "artist.pastShows.edges.node.cover_image.url": (v12/*: any*/),
        "artist.pastShows.edges.node.exhibition_period": (v12/*: any*/),
        "artist.pastShows.edges.node.href": (v12/*: any*/),
        "artist.pastShows.edges.node.id": (v13/*: any*/),
        "artist.pastShows.edges.node.is_fair_booth": (v14/*: any*/),
        "artist.pastShows.edges.node.kind": (v12/*: any*/),
        "artist.pastShows.edges.node.location": (v15/*: any*/),
        "artist.pastShows.edges.node.location.city": (v12/*: any*/),
        "artist.pastShows.edges.node.location.id": (v13/*: any*/),
        "artist.pastShows.edges.node.name": (v12/*: any*/),
        "artist.pastShows.edges.node.partner": (v16/*: any*/),
        "artist.pastShows.edges.node.partner.__isNode": (v17/*: any*/),
        "artist.pastShows.edges.node.partner.__typename": (v17/*: any*/),
        "artist.pastShows.edges.node.partner.id": (v13/*: any*/),
        "artist.pastShows.edges.node.partner.name": (v12/*: any*/),
        "artist.pastShows.edges.node.slug": (v13/*: any*/),
        "artist.pastShows.edges.node.status": (v12/*: any*/),
        "artist.pastShows.edges.node.status_update": (v12/*: any*/),
        "artist.upcomingShows": (v8/*: any*/),
        "artist.upcomingShows.edges": (v9/*: any*/),
        "artist.upcomingShows.edges.node": (v10/*: any*/),
        "artist.upcomingShows.edges.node.cover_image": (v11/*: any*/),
        "artist.upcomingShows.edges.node.cover_image.url": (v12/*: any*/),
        "artist.upcomingShows.edges.node.exhibition_period": (v12/*: any*/),
        "artist.upcomingShows.edges.node.href": (v12/*: any*/),
        "artist.upcomingShows.edges.node.id": (v13/*: any*/),
        "artist.upcomingShows.edges.node.is_fair_booth": (v14/*: any*/),
        "artist.upcomingShows.edges.node.kind": (v12/*: any*/),
        "artist.upcomingShows.edges.node.location": (v15/*: any*/),
        "artist.upcomingShows.edges.node.location.city": (v12/*: any*/),
        "artist.upcomingShows.edges.node.location.id": (v13/*: any*/),
        "artist.upcomingShows.edges.node.name": (v12/*: any*/),
        "artist.upcomingShows.edges.node.partner": (v16/*: any*/),
        "artist.upcomingShows.edges.node.partner.__isNode": (v17/*: any*/),
        "artist.upcomingShows.edges.node.partner.__typename": (v17/*: any*/),
        "artist.upcomingShows.edges.node.partner.id": (v13/*: any*/),
        "artist.upcomingShows.edges.node.partner.name": (v12/*: any*/),
        "artist.upcomingShows.edges.node.slug": (v13/*: any*/),
        "artist.upcomingShows.edges.node.status": (v12/*: any*/),
        "artist.upcomingShows.edges.node.status_update": (v12/*: any*/)
      }
    },
    "name": "ArtistAboutShowsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c2d2e97277ce92e509fcef8e50f81253';
export default node;
