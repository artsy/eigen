/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerLocationsQueryVariables = {
    partnerID: string;
};
export type PartnerLocationsQueryResponse = {
    readonly partner: {
        readonly " $fragmentRefs": FragmentRefs<"PartnerLocations_partner">;
    } | null;
};
export type PartnerLocationsQuery = {
    readonly response: PartnerLocationsQueryResponse;
    readonly variables: PartnerLocationsQueryVariables;
};



/*
query PartnerLocationsQuery(
  $partnerID: String!
) {
  partner(id: $partnerID) {
    ...PartnerLocations_partner
    id
  }
}

fragment PartnerLocations_partner on Partner {
  name
  locations {
    id
    ...PartnerMap_location
  }
}

fragment PartnerMap_location on Location {
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "partnerID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "partnerID"
  }
],
v2 = {
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
    "name": "PartnerLocationsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "PartnerLocations_partner",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PartnerLocationsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "locations",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": true,
            "selections": [
              (v2/*: any*/),
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
                "name": "address2",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "postalCode",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "summary",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "coordinates",
                "storageKey": null,
                "args": null,
                "concreteType": "LatLng",
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
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PartnerLocationsQuery",
    "id": "ec58a7d50b3fd650db62099f4a882106",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8c0169823cc4cc8238e18e15801a6857';
export default node;
