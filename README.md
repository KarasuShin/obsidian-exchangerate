# Obsidian Exchange Rate Plugin

A simple and easy-to-use Obsidian plugin for fetching and converting exchange rates between different currencies. Data is provided by [Exchange Rate API](https://www.exchangerate-api.com).

## Features

- Get real-time exchange rate data
- Support conversion between various international currencies
- Provides a simple JavaScript API interface
- Implements caching to reduce API calls and improve performance

## Usage

After installation, the plugin registers an `exchangerate` object in the global scope, which you can use in Obsidian's JavaScript environment (such as Dataview JS or Templater JS):

### Get Exchange Rates

```javascript
// Get all exchange rates for USD
const rates = await exchangerate.rates('USD');
console.log(`1 USD = ${rates.EUR} EUR`);

// Get the exchange rate from USD to EUR
const rate = await exchangerate.rate('USD', 'EUR');
console.log(`1 USD = ${rate} EUR`);
```

### Convert Currency Amount

```javascript
// Convert 100 USD to EUR
const amount = await exchangerate.transform('USD', 'EUR', 100);
console.log(`100 USD = ${amount} EUR`);
```

## Data Caching

To optimize performance and reduce unnecessary API calls, the plugin implements a caching mechanism for exchange rate data:

- Exchange rate data is cached locally when first requested
- Fresh data is fetched only when needed (when cache is empty or outdated)
- This ensures up-to-date exchange rates while minimizing API requests

## API Documentation

### `exchangerate.rates(currency)`

Get exchange rates from the specified currency to all other available currencies.

**Parameters:**
- `currency` (string): Source currency code (e.g., 'USD')

**Returns:**
- `Promise<Record<string, number>>`: An object containing exchange rates to all other currencies

### `exchangerate.rate(fromCurrency, toCurrency)`

Get the exchange rate between two specific currencies.

**Parameters:**
- `sourceCurrency` (string): Source currency code (e.g., 'USD')
- `targetCurrency` (string): Target currency code (e.g., 'EUR')

**Returns:**
- `Promise<number>`: The exchange rate value

### `exchangerate.transform(fromCurrency, toCurrency, amount)`

Convert a specified amount from one currency to another.

**Parameters:**
- `sourceCurrency` (string): Source currency code (e.g., 'USD')
- `targetCurrency` (string): Target currency code (e.g., 'EUR')
- `amount` (number): The amount to convert

**Returns:**
- `Promise<number>`: The converted amount

## Supported Currencies

This plugin supports all currencies [provided by Exchange Rate API](https://www.exchangerate-api.com/docs/supported-currencies), including but not limited to:
- USD (US Dollar)
- EUR (Euro)
- JPY (Japanese Yen)
- GBP (British Pound)
- CNY (Chinese Yuan)
- And many more...

## License

This project is open source under the MIT License.

