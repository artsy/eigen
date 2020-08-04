/* tslint:disable */
/* eslint-disable */
/* @relayHash 3d98c1c743081603a44a208641dc1c9e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesFullArtistSeriesListQueryVariables = {
    artistID: string;
};
export type ArtistSeriesFullArtistSeriesListQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesFullArtistSeriesList_artist">;
    } | null;
};
export type ArtistSeriesFullArtistSeriesListQuery = {
    readonly response: ArtistSeriesFullArtistSeriesListQueryResponse;
    readonly variables: ArtistSeriesFullArtistSeriesListQueryVariables;
};



/*
query ArtistSeriesFullArtistSeriesListQuery(
  $artistID: String!
) {
  artist(id: $artistID) {
    ...ArtistSeriesFullArtistSeriesList_artist
    id
  }
}

fragment ArtistSeriesFullArtistSeriesList_artist on Artist {
  artistSeriesConnection {
    edges {
      node {
        slug
        internalID
        title
        forSaleArtworksCount
        image {
          url
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artistID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistSeriesFullArtistSeriesListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtistSeriesFullArtistSeriesList_artist",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesFullArtistSeriesListQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artistSeriesConnection",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistSeriesConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistSeriesEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtistSeries",
                    "plural": false,
                    "selections": [
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
                        "name": "internalID",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "title",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "forSaleArtworksCount",
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistSeriesFullArtistSeriesListQuery",
    "id": "dd54c7ccee7fa4c3b27983fb043635de",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '03e4b7a4caca1fd2d94dcbe17c2d3eaf';
export default node;
