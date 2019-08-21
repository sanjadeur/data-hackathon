const pollutionToMap = {
  "Antigua and Barbuda": "Antigua and Barb.",
  "Bosnia and Herzegovina": "Bosnia and Herz.",
  "British Virgin Islands": "British Virgin Is.",
  "Brunei Darussalam": "Brunei",
  "Cabo Verde": "Cape Verde",
  "Cayman Islands": "Cayman Is.",
  "Central African Republic": "Central African Rep.",
  "Congo": "Congo (Brazzaville)",
  "Congo, Democratic Republic of": "Congo (Kinshasa)",
  "Côte d'Ivoire": "Ivory Coast",
  "Czech Republic": "Czech Rep.",
  "Dominican Republic": "Dominican Rep.",
  "Equatorial Guinea": "Eq. Guinea",
  "French Guiana": undefined,
  "French Polynesia": "Fr. Polynesia",
  "Guadeloupe": undefined,
  "Guinea-Bissau": "Guinea Bissau",
  "Iran, Islamic Republic of": "Iran",
  "Korea, Democratic People's Republic of": "N. Korea",
  "Korea, Republic of": "S. Korea",
  "Lao People's Democratic Republic": "Laos",
  "Libyan Arab Jamahiriya": "Libya",
  "Macedonia TFYR": "Macedonia",
  "Martinique": undefined,
  "Réunion": undefined,
  "Russian Federation": "Russia",
  "Saint Kitts and Nevis": "St. Kitts and Nevis",
  "Saint Vincent and Grenadines": "St. Vin. and Gren.",
  "Solomon Islands": "Solomon Is.",
  "Syrian Arab Republic": "Syria",
  "Tanzania, United Republic of": "Tanzania",
  "Timor-Leste": "East Timor",
  "United States of America": "United States",
  "Venezuela, Bolivarian Republic of": "Venezuela",
  "Viet Nam": "Vietnam",
  "Wallis and Futuna Islands": "Wallis and Futuna"
};

const mapToPollution = Object.keys(pollutionToMap).reduce(
    (acc, key) => { 
        acc[pollutionToMap[key]] = key;
        return acc 
    }, 
    {}
);