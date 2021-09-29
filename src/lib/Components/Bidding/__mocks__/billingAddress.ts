export const mockFullAddress = {
  fullName: "john doe",
  addressLine1: "elm street 13",
  addressLine2: "second floor",
  city: "berlin",
  state: "berlin",
  country: {
    longName: "germany",
    shortName: "de",
  },
  postalCode: "000000",
  phoneNumber: "+11111111111",
}

export const mockPartiallyEmptyAddress = {
  fullName: "",
  addressLine1: "elm street 13",
  addressLine2: "second floor",
  city: "berlin",
  state: "",
  country: {
    longName: "germany",
    shortName: "",
  },
  postalCode: "000000",
  phoneNumber: "+11111111111",
}
