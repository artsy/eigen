/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ShowArtists_show$ref } from "./ShowArtists_show.graphql";
export type ShowArtistsQueryVariables = {
    readonly showID: string;
};
export type ShowArtistsQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": ShowArtists_show$ref;
    }) | null;
};
export type ShowArtistsQuery = {
    readonly response: ShowArtistsQueryResponse;
    readonly variables: ShowArtistsQueryVariables;
};



/*
query ShowArtistsQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...ShowArtists_show
    __id
  }
}

fragment ShowArtists_show on Show {
  _id
  id
  artists_grouped_by_name {
    letter
    items {
      ...ArtistListItem_artist
      sortable_id
      href
      __id
    }
  }
  __id
}

fragment ArtistListItem_artist on Artist {
  __id
  _id
  id
  name
  is_followed
  nationality
  birthday
  deathday
  image {
    url
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "showID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "showID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ShowArtistsQuery",
  "id": "323650445314a3f73847f8372e038cc1",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ShowArtistsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": v1,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ShowArtists_show",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowArtistsQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": v1,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          v3,
          v4,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists_grouped_by_name",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistGroup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "letter",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "items",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "nationality",
                    "args": null,
                    "storageKey": null
                  },
                  v2,
                  v4,
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
                  v3,
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "sortable_id",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "href",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = '6df07207a68e180b435619e641ce4a18';
export default node;
