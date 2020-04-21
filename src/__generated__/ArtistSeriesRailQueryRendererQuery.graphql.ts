/* tslint:disable */
/* eslint-disable */
/* @relayHash 4550950a2f3f5010958aabb9c826dee5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesRailQueryRendererQueryVariables = {
    isFeaturedArtistContent?: boolean | null;
    size?: number | null;
    artistID?: string | null;
};
export type ArtistSeriesRailQueryRendererQueryResponse = {
    readonly collections: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesRail_collections">;
    }>;
};
export type ArtistSeriesRailQueryRendererQuery = {
    readonly response: ArtistSeriesRailQueryRendererQueryResponse;
    readonly variables: ArtistSeriesRailQueryRendererQueryVariables;
};



/*
query ArtistSeriesRailQueryRendererQuery(
  $isFeaturedArtistContent: Boolean
  $size: Int
  $artistID: String
) {
  collections: marketingCollections(isFeaturedArtistContent: $isFeaturedArtistContent, size: $size, artistID: $artistID) {
    ...ArtistSeriesRail_collections
    id
  }
}

fragment ArtistSeriesRail_collections on MarketingCollection {
  headerImage
  slug
  title
  price_guidance
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "isFeaturedArtistContent",
    "type": "Boolean",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "size",
    "type": "Int",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "artistID",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "artistID",
    "variableName": "artistID"
  },
  {
    "kind": "Variable",
    "name": "isFeaturedArtistContent",
    "variableName": "isFeaturedArtistContent"
  },
  {
    "kind": "Variable",
    "name": "size",
    "variableName": "size"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistSeriesRailQueryRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "collections",
        "name": "marketingCollections",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": true,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtistSeriesRail_collections",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesRailQueryRendererQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "collections",
        "name": "marketingCollections",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "headerImage",
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
            "name": "title",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "price_guidance",
            "args": null,
            "storageKey": null
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
    "name": "ArtistSeriesRailQueryRendererQuery",
    "id": "9ea48667b7b010baec68029fcbc13a44",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c36bef8841fa83a91fa22b8d7a159d53';
export default node;
