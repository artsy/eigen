/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ArtistListItem_artist$ref } from "./ArtistListItem_artist.graphql";
export type ArtistsGroupedByNameTestsQueryVariables = {};
export type ArtistsGroupedByNameTestsQueryResponse = {
    readonly artist: ({
        readonly " $fragmentRefs": ArtistListItem_artist$ref;
    }) | null;
};
export type ArtistsGroupedByNameTestsQuery = {
    readonly response: ArtistsGroupedByNameTestsQueryResponse;
    readonly variables: ArtistsGroupedByNameTestsQueryVariables;
};



/*
query ArtistsGroupedByNameTestsQuery {
  artist(id: "pablo-picasso") {
    ...ArtistListItem_artist
    __id: id
  }
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  gravityID
  name
  is_followed
  nationality
  birthday
  deathday
  image {
    url
  }
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "pablo-picasso",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ArtistsGroupedByNameTestsQuery",
  "id": null,
  "text": "query ArtistsGroupedByNameTestsQuery {\n  artist(id: \"pablo-picasso\") {\n    ...ArtistListItem_artist\n    __id: id\n  }\n}\n\nfragment ArtistListItem_artist on Artist {\n  id\n  internalID\n  gravityID\n  name\n  is_followed\n  nationality\n  birthday\n  deathday\n  image {\n    url\n  }\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistsGroupedByNameTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"pablo-picasso\")",
        "args": v0,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtistListItem_artist",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistsGroupedByNameTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"pablo-picasso\")",
        "args": v0,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
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
            "name": "gravityID",
            "args": null,
            "storageKey": null
          },
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
            "name": "is_followed",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "nationality",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "birthday",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "deathday",
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
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = '2ad7ccc5edb7b44552acbbc3f35b6582';
export default node;
