/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d33dcbe49dbc1594d21db6e3944e7bba */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EditSavedSearchAlertTestsQueryVariables = {
    savedSearchAlertId: string;
    artistID: string;
};
export type EditSavedSearchAlertTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"EditSavedSearchAlert_me">;
    } | null;
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"EditSavedSearchAlert_artist">;
    } | null;
};
export type EditSavedSearchAlertTestsQuery = {
    readonly response: EditSavedSearchAlertTestsQueryResponse;
    readonly variables: EditSavedSearchAlertTestsQueryVariables;
};



/*
query EditSavedSearchAlertTestsQuery(
  $savedSearchAlertId: ID!
  $artistID: String!
) {
  me {
    ...EditSavedSearchAlert_me_4i8ECC
    id
  }
  artist(id: $artistID) {
    ...EditSavedSearchAlert_artist
    id
  }
}

fragment EditSavedSearchAlert_artist on Artist {
  internalID
  name
  filterArtworksConnection(first: 1, aggregations: [LOCATION_CITY, MATERIALS_TERMS, MEDIUM, PARTNER]) {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    id
  }
}

fragment EditSavedSearchAlert_me_4i8ECC on Me {
  savedSearch(id: $savedSearchAlertId) {
    internalID
    acquireable
    additionalGeneIDs
    artistID
    atAuction
    attributionClass
    colors
    dimensionRange
    height
    inquireableOnly
    locationCities
    majorPeriods
    materialsTerms
    offerable
    partnerIDs
    priceRange
    userAlertSettings {
      name
    }
    width
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "artistID"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "savedSearchAlertId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v7 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": true,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "EditSavedSearchAlertTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": [
              {
                "kind": "Variable",
                "name": "savedSearchAlertId",
                "variableName": "savedSearchAlertId"
              }
            ],
            "kind": "FragmentSpread",
            "name": "EditSavedSearchAlert_me"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EditSavedSearchAlert_artist"
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "EditSavedSearchAlertTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "id",
                "variableName": "savedSearchAlertId"
              }
            ],
            "concreteType": "SearchCriteria",
            "kind": "LinkedField",
            "name": "savedSearch",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "acquireable",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "additionalGeneIDs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "artistID",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "atAuction",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "attributionClass",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "colors",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "dimensionRange",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "height",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "inquireableOnly",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "locationCities",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "majorPeriods",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "materialsTerms",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "offerable",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "partnerIDs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "priceRange",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SavedSearchUserAlertSettings",
                "kind": "LinkedField",
                "name": "userAlertSettings",
                "plural": false,
                "selections": [
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "width",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "LOCATION_CITY",
                  "MATERIALS_TERMS",
                  "MEDIUM",
                  "PARTNER"
                ]
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
                "kind": "LinkedField",
                "name": "aggregations",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "slice",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AggregationCount",
                    "kind": "LinkedField",
                    "name": "counts",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "value",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(aggregations:[\"LOCATION_CITY\",\"MATERIALS_TERMS\",\"MEDIUM\",\"PARTNER\"],first:1)"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d33dcbe49dbc1594d21db6e3944e7bba",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "artist.filterArtworksConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksConnection"
        },
        "artist.filterArtworksConnection.aggregations": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworksAggregationResults"
        },
        "artist.filterArtworksConnection.aggregations.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AggregationCount"
        },
        "artist.filterArtworksConnection.aggregations.counts.count": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "artist.filterArtworksConnection.aggregations.counts.name": (v6/*: any*/),
        "artist.filterArtworksConnection.aggregations.counts.value": (v6/*: any*/),
        "artist.filterArtworksConnection.aggregations.slice": {
          "enumValues": [
            "ARTIST",
            "ARTIST_NATIONALITY",
            "ATTRIBUTION_CLASS",
            "COLOR",
            "DIMENSION_RANGE",
            "FOLLOWED_ARTISTS",
            "GALLERY",
            "INSTITUTION",
            "LOCATION_CITY",
            "MAJOR_PERIOD",
            "MATERIALS_TERMS",
            "MEDIUM",
            "MERCHANDISABLE_ARTISTS",
            "PARTNER",
            "PARTNER_CITY",
            "PERIOD",
            "PRICE_RANGE",
            "TOTAL"
          ],
          "nullable": true,
          "plural": false,
          "type": "ArtworkAggregation"
        },
        "artist.filterArtworksConnection.id": (v7/*: any*/),
        "artist.id": (v7/*: any*/),
        "artist.internalID": (v7/*: any*/),
        "artist.name": (v8/*: any*/),
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v7/*: any*/),
        "me.savedSearch": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SearchCriteria"
        },
        "me.savedSearch.acquireable": (v9/*: any*/),
        "me.savedSearch.additionalGeneIDs": (v10/*: any*/),
        "me.savedSearch.artistID": (v8/*: any*/),
        "me.savedSearch.atAuction": (v9/*: any*/),
        "me.savedSearch.attributionClass": (v10/*: any*/),
        "me.savedSearch.colors": (v10/*: any*/),
        "me.savedSearch.dimensionRange": (v8/*: any*/),
        "me.savedSearch.height": (v8/*: any*/),
        "me.savedSearch.inquireableOnly": (v9/*: any*/),
        "me.savedSearch.internalID": (v7/*: any*/),
        "me.savedSearch.locationCities": (v10/*: any*/),
        "me.savedSearch.majorPeriods": (v10/*: any*/),
        "me.savedSearch.materialsTerms": (v10/*: any*/),
        "me.savedSearch.offerable": (v9/*: any*/),
        "me.savedSearch.partnerIDs": (v10/*: any*/),
        "me.savedSearch.priceRange": (v8/*: any*/),
        "me.savedSearch.userAlertSettings": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "SavedSearchUserAlertSettings"
        },
        "me.savedSearch.userAlertSettings.name": (v8/*: any*/),
        "me.savedSearch.width": (v8/*: any*/)
      }
    },
    "name": "EditSavedSearchAlertTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '71b63c512740f017ff3dbd6efa56234d';
export default node;
