const countryDataMap = {
  "AF": { "currency": "Afghan afghani", "currencySymbol": "؋", "callingCode": "93" },
  "AL": { "currency": "Albanian lek", "currencySymbol": "L", "callingCode": "355" },
  "DZ": { "currency": "Algerian dinar", "currencySymbol": "د.ج", "callingCode": "213" },
  "BR": { "currency": "Brazilian real", "currencySymbol": "R$", "callingCode": "55" },
  "US": { "currency": "United States dollar", "currencySymbol": "$", "callingCode": "1" },
  // ... Simplified for now, or I could copy the whole map
};

function enrichCountryData(countryCode) {
  return countryDataMap[countryCode] || null;
}

module.exports = { enrichCountryData, countryDataMap };
