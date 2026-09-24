/**
 * MOCK DATA: neighbourhood isn't stored anywhere in Gravity, so this is editorial. The
 * grouping input (postalCode) is real; delete this file once `Location.neighborhood` lands.
 */
export interface NeighborhoodDef {
  id: string
  title: string
  /** Normalised postcode prefixes: uppercase, no whitespace. Longest match wins. */
  postalPrefixes: string[]
}

export const MOCK_NEIGHBORHOODS: Record<string, NeighborhoodDef[]> = {
  "london-united-kingdom": [
    { id: "farringdon", title: "Farringdon", postalPrefixes: ["EC1"] },
    { id: "central-london", title: "Central London", postalPrefixes: ["W1", "SW1", "WC1", "WC2"] },
    { id: "east-london", title: "East London", postalPrefixes: ["E1", "E2", "E8", "E9", "EC2"] },
    {
      id: "north-london",
      title: "North London",
      postalPrefixes: ["N1", "N4", "NW1", "NW3", "NW5", "NW8"],
    },
    { id: "south-london", title: "South London", postalPrefixes: ["SE1", "SE5", "SE8", "SE15"] },
    {
      id: "west-london",
      title: "West London",
      postalPrefixes: ["W2", "W8", "W10", "W11", "SW3", "SW6", "SW7"],
    },
  ],
  "new-york-ny-usa": [
    { id: "chelsea", title: "Chelsea", postalPrefixes: ["10001", "10011"] },
    {
      id: "lower-east-side",
      title: "Lower East Side & East Village",
      postalPrefixes: ["10002", "10003", "10009"],
    },
    { id: "tribeca-soho", title: "Tribeca & SoHo", postalPrefixes: ["10007", "10012", "10013"] },
    { id: "west-village", title: "West Village", postalPrefixes: ["10014"] },
    {
      id: "midtown",
      title: "Midtown",
      postalPrefixes: ["10016", "10017", "10018", "10019", "10020", "10022", "10036"],
    },
    {
      id: "upper-east-side",
      title: "Upper East Side",
      postalPrefixes: ["10021", "10028", "10065", "10075", "10128"],
    },
    {
      id: "harlem",
      title: "Harlem",
      postalPrefixes: ["10026", "10027", "10030", "10035", "10037", "10039"],
    },
    { id: "brooklyn", title: "Brooklyn", postalPrefixes: ["112"] },
  ],
  "los-angeles-ca-usa": [
    {
      id: "downtown-arts-district",
      title: "Downtown & Arts District",
      postalPrefixes: ["90012", "90013", "90014", "90015", "90017", "90021", "90071"],
    },
    { id: "hollywood", title: "Hollywood", postalPrefixes: ["90004", "90028", "90029", "90038"] },
    { id: "west-hollywood", title: "West Hollywood", postalPrefixes: ["90046", "90048", "90069"] },
    { id: "miracle-mile", title: "Miracle Mile", postalPrefixes: ["90036"] },
    { id: "beverly-hills", title: "Beverly Hills", postalPrefixes: ["90210", "90211", "90212"] },
    { id: "west-adams", title: "West Adams", postalPrefixes: ["90016", "90018"] },
    { id: "culver-city", title: "Culver City", postalPrefixes: ["90034", "90230", "90232"] },
    { id: "santa-monica", title: "Santa Monica", postalPrefixes: ["904"] },
  ],
  // Berlin codes sometimes carry a "D-" country prefix.
  "berlin-germany": [
    { id: "mitte", title: "Mitte", postalPrefixes: ["101", "D-101"] },
    { id: "kreuzberg", title: "Kreuzberg", postalPrefixes: ["109", "D-109"] },
    {
      id: "schoeneberg-tiergarten",
      title: "Schöneberg & Tiergarten",
      postalPrefixes: ["10777", "10779", "10781", "10783", "10785", "10787", "D-10785"],
    },
    {
      id: "charlottenburg",
      title: "Charlottenburg",
      postalPrefixes: ["106", "10585", "10587", "10589", "10719", "14059", "D-106", "D-10719"],
    },
  ],
  "miami-fl-usa": [
    { id: "wynwood", title: "Wynwood", postalPrefixes: ["33127"] },
    { id: "allapattah", title: "Allapattah", postalPrefixes: ["33142"] },
    { id: "design-district", title: "Design District", postalPrefixes: ["33137"] },
    {
      id: "downtown-miami",
      title: "Downtown Miami",
      postalPrefixes: ["33128", "33130", "33131", "33132", "33136"],
    },
    { id: "miami-beach", title: "Miami Beach", postalPrefixes: ["33139", "33140", "33141"] },
  ],
  "san-francisco-ca-usa": [
    {
      id: "union-square",
      title: "Union Square & Downtown",
      postalPrefixes: ["94102", "94104", "94108", "94109", "94111", "94133"],
    },
    {
      id: "soma-dogpatch",
      title: "SoMa & Dogpatch",
      postalPrefixes: ["94103", "94105", "94107", "94158"],
    },
    { id: "marina", title: "Marina & Fort Mason", postalPrefixes: ["94123"] },
    { id: "oakland", title: "Oakland", postalPrefixes: ["946"] },
  ],
  "milan-italy": [
    { id: "centro-brera", title: "Centro & Brera", postalPrefixes: ["20121", "20122", "20123"] },
    { id: "porta-venezia", title: "Porta Venezia", postalPrefixes: ["20124", "20129"] },
    { id: "porta-volta", title: "Porta Volta & Sempione", postalPrefixes: ["20154"] },
    {
      id: "citylife-fiera",
      title: "CityLife & Fiera",
      postalPrefixes: ["20145", "20148", "20149"],
    },
  ],
  // CEP prefixes: 014 is Jardins, 054 is Pinheiros.
  "sao-paulo-brazil": [
    { id: "jardins", title: "Jardins", postalPrefixes: ["014"] },
    { id: "pinheiros", title: "Pinheiros & Vila Madalena", postalPrefixes: ["054"] },
    { id: "ibirapuera", title: "Ibirapuera", postalPrefixes: ["04094"] },
  ],
  "tokyo-japan": [
    { id: "ginza", title: "Ginza & Nihonbashi", postalPrefixes: ["103", "104"] },
    { id: "roppongi", title: "Roppongi & Minato", postalPrefixes: ["105", "106", "107", "108"] },
    { id: "shibuya", title: "Shibuya", postalPrefixes: ["150", "151"] },
    { id: "tennozu", title: "Tennozu", postalPrefixes: ["140-0002", "1400002"] },
  ],
  "toronto-canada": [
    { id: "distillery-district", title: "Distillery District", postalPrefixes: ["M5A"] },
    { id: "yorkville", title: "Yorkville", postalPrefixes: ["M5R"] },
    { id: "king-west", title: "King West & Queen West", postalPrefixes: ["M5V", "M6J"] },
    { id: "junction-triangle", title: "Junction Triangle", postalPrefixes: ["M6P"] },
  ],
  "mexico-city-mexico": [
    { id: "roma", title: "Roma", postalPrefixes: ["06700", "06760"] },
    { id: "condesa", title: "Condesa", postalPrefixes: ["06100", "06140", "06170"] },
    { id: "san-rafael-juarez", title: "San Rafael & Juárez", postalPrefixes: ["06470", "06600"] },
    {
      id: "polanco",
      title: "Polanco",
      postalPrefixes: ["11510", "11530", "11540", "11550", "11560"],
    },
    {
      id: "san-miguel-chapultepec",
      title: "San Miguel Chapultepec",
      postalPrefixes: ["11850", "11870"],
    },
  ],
  "brussels-belgium": [
    { id: "brussels-centre", title: "Centre & Sablon", postalPrefixes: ["1000", "B-1000"] },
    { id: "ixelles", title: "Ixelles", postalPrefixes: ["1050", "B-1050"] },
    { id: "saint-gilles", title: "Saint-Gilles", postalPrefixes: ["1060", "B-1060"] },
    { id: "uccle", title: "Uccle", postalPrefixes: ["1180", "B-1180"] },
  ],
  // Singapore postcodes lead with a two-digit sector; Gillman Barracks sits inside sector 10.
  "singapore-singapore": [
    { id: "marina-bay", title: "Marina Bay & Downtown", postalPrefixes: ["01", "03", "04", "06"] },
    { id: "chinatown", title: "Chinatown & Tanjong Pagar", postalPrefixes: ["05", "07", "08"] },
    { id: "gillman-barracks", title: "Gillman Barracks", postalPrefixes: ["1089", "10944"] },
    { id: "tiong-bahru", title: "Tiong Bahru", postalPrefixes: ["16"] },
    { id: "orchard", title: "Orchard", postalPrefixes: ["22", "23"] },
  ],
  "barcelona-spain": [
    {
      id: "ciutat-vella",
      title: "Gòtic, Born & Raval",
      postalPrefixes: ["08001", "08002", "08003"],
    },
    { id: "sant-pere", title: "Sant Pere & Trafalgar", postalPrefixes: ["08010"] },
    {
      id: "eixample",
      title: "Eixample",
      postalPrefixes: [
        "08007",
        "08008",
        "08009",
        "08011",
        "08013",
        "08015",
        "08025",
        "08029",
        "08036",
        "08037",
      ],
    },
    {
      id: "gracia-sant-gervasi",
      title: "Gràcia & Sant Gervasi",
      postalPrefixes: ["08006", "08012", "08021", "08024"],
    },
  ],
  "cape-town-south-africa": [
    {
      id: "city-centre",
      title: "City Centre & Waterfront",
      postalPrefixes: ["8000", "8001", "8002", "8005"],
    },
    { id: "woodstock", title: "Woodstock & Salt River", postalPrefixes: ["7915", "7925"] },
  ],
  "istanbul-turkiye": [
    { id: "beyoglu", title: "Beyoğlu & Karaköy", postalPrefixes: ["3442", "3443", "3444"] },
    { id: "nisantasi", title: "Nişantaşı & Harbiye", postalPrefixes: ["34365", "34367"] },
  ],
  // Post-2015 codes lead with the district (030-031 Jongno, 060-063 Gangnam); "110-" and
  // "135-" are the old six-digit Jongno and Gangnam codes.
  "seoul-south-korea": [
    { id: "jongno", title: "Samcheong-dong & Insadong", postalPrefixes: ["030", "031", "110-"] },
    { id: "seongbuk", title: "Seongbuk-dong", postalPrefixes: ["027", "028"] },
    { id: "yongsan", title: "Hannam & Itaewon", postalPrefixes: ["043", "044"] },
    { id: "mapo", title: "Hongdae & Yeonnam", postalPrefixes: ["039", "040", "041"] },
    { id: "seongsu", title: "Seongsu", postalPrefixes: ["047", "048"] },
    {
      id: "gangnam",
      title: "Cheongdam & Dosan",
      postalPrefixes: ["060", "061", "062", "063", "135-"],
    },
  ],
  "venice-italy": [
    { id: "san-marco", title: "San Marco", postalPrefixes: ["30124"] },
    { id: "dorsoduro", title: "Dorsoduro", postalPrefixes: ["30123"] },
    { id: "cannaregio", title: "Cannaregio", postalPrefixes: ["30121"] },
    { id: "castello", title: "Castello", postalPrefixes: ["30122"] },
    {
      id: "san-polo-santa-croce",
      title: "San Polo & Santa Croce",
      postalPrefixes: ["30125", "30135"],
    },
    { id: "giudecca", title: "Giudecca", postalPrefixes: ["30133"] },
    { id: "murano", title: "Murano", postalPrefixes: ["30141"] },
  ],
  // Paris arrondissements map one-to-one to postcodes; 75116 is the 16th's northern half.
  "paris-france": [
    { id: "paris-1", title: "1st arrondissement", postalPrefixes: ["75001"] },
    { id: "paris-2", title: "2nd arrondissement", postalPrefixes: ["75002"] },
    { id: "paris-3", title: "3rd arrondissement", postalPrefixes: ["75003"] },
    { id: "paris-4", title: "4th arrondissement", postalPrefixes: ["75004"] },
    { id: "paris-5", title: "5th arrondissement", postalPrefixes: ["75005"] },
    { id: "paris-6", title: "6th arrondissement", postalPrefixes: ["75006"] },
    { id: "paris-7", title: "7th arrondissement", postalPrefixes: ["75007"] },
    { id: "paris-8", title: "8th arrondissement", postalPrefixes: ["75008"] },
    { id: "paris-9", title: "9th arrondissement", postalPrefixes: ["75009"] },
    { id: "paris-10", title: "10th arrondissement", postalPrefixes: ["75010"] },
    { id: "paris-11", title: "11th arrondissement", postalPrefixes: ["75011"] },
    { id: "paris-12", title: "12th arrondissement", postalPrefixes: ["75012"] },
    { id: "paris-13", title: "13th arrondissement", postalPrefixes: ["75013"] },
    { id: "paris-14", title: "14th arrondissement", postalPrefixes: ["75014"] },
    { id: "paris-15", title: "15th arrondissement", postalPrefixes: ["75015"] },
    { id: "paris-16", title: "16th arrondissement", postalPrefixes: ["75016", "75116"] },
    { id: "paris-17", title: "17th arrondissement", postalPrefixes: ["75017"] },
    { id: "paris-18", title: "18th arrondissement", postalPrefixes: ["75018"] },
    { id: "paris-19", title: "19th arrondissement", postalPrefixes: ["75019"] },
    { id: "paris-20", title: "20th arrondissement", postalPrefixes: ["75020"] },
  ],
}
