/* tslint:disable */
/* eslint-disable */
/* @relayHash 6e8cf1dd816abed408ae8090f7993e8b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomArtworkQueryVariables = {
    viewingRoomID: string;
    artworkID: string;
};
export type ViewingRoomArtworkQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtwork_selectedArtwork">;
    } | null;
    readonly viewingRoom: {
        readonly title: string;
        readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtwork_artworksList">;
    } | null;
};
export type ViewingRoomArtworkQuery = {
    readonly response: ViewingRoomArtworkQueryResponse;
    readonly variables: ViewingRoomArtworkQueryVariables;
};



/*
query ViewingRoomArtworkQuery(
  $viewingRoomID: ID!
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    ...ViewingRoomArtwork_selectedArtwork
    id
  }
  viewingRoom(id: $viewingRoomID) {
    title
    ...ViewingRoomArtwork_artworksList
  }
}

fragment ViewingRoomArtwork_artworksList on ViewingRoom {
  artworksConnection(first: 1) {
    edges {
      node {
        title
        artistNames
        date
        description
        saleMessage
        image {
          url(version: "larger")
          aspectRatio
        }
        id
      }
    }
  }
}

fragment ViewingRoomArtwork_selectedArtwork on Artwork {
  title
  artistNames
  date
  description
  saleMessage
  href
  image {
    url(version: "larger")
    aspectRatio
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "viewingRoomID",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "artworkID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "viewingRoomID"
  }
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "description",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v8 = {
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
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": "larger"
        }
      ],
      "storageKey": "url(version:\"larger\")"
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "aspectRatio",
      "args": null,
      "storageKey": null
    }
  ]
},
v9 = {
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
    "name": "ViewingRoomArtworkQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ViewingRoomArtwork_selectedArtwork",
            "args": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewingRoom",
        "storageKey": null,
        "args": (v2/*: any*/),
        "concreteType": "ViewingRoom",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "FragmentSpread",
            "name": "ViewingRoomArtwork_artworksList",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomArtworkQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "href",
            "args": null,
            "storageKey": null
          },
          (v8/*: any*/),
          (v9/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewingRoom",
        "storageKey": null,
        "args": (v2/*: any*/),
        "concreteType": "ViewingRoom",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtworkEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ViewingRoomArtworkQuery",
    "id": "e94713734a6bd0f65159bedecdeb2ed1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8a56892678a2a645802e34eb3133f3af';
export default node;
