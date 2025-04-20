import { Plugin, requestUrl } from 'obsidian';
import dayjs from 'dayjs';

interface ExchangeRatePluginSettings {
	exchangeRateData: Record<string, {
		lastUpdated: number;
		rates: Record<string, number>;
	}>;
}

const DEFAULT_SETTINGS: ExchangeRatePluginSettings = {
	exchangeRateData: {}
}

interface ExchangeRateResponse {
	base_code: string;
	documentation: string;
	provider: string
	result: string;
	terms_of_use: string;
	time_eol_unix: number;
	time_last_update_unix: number;
	time_last_update_utc: string;
	time_next_update_unix: number;
	time_next_update_utc: string;
	rates: Record<string, number>;
}

export default class ExchangeRatePlugin extends Plugin {
	settings: ExchangeRatePluginSettings;

	async onload() {
		await this.loadSettings();

		(window as any).exchangerate = {
			transform: this.transformCurrency.bind(this),
			rate: this.getCurrencyRate.bind(this),
			rates: this.getCurrencyRates.bind(this)
		};
	}

	onunload() {
		delete (window as any).exchangerate;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async transformCurrency(sourceCurrency: string, targetCurrency: string, amount: number): Promise<number> {
		const rate = await this.getCurrencyRate(sourceCurrency, targetCurrency);
		return Number((amount * rate).toFixed(6));
	}

	async getCurrencyRate(sourceCurrency: string, targetCurrency: string): Promise<number> {
		const source = sourceCurrency.toUpperCase();
		const target = targetCurrency.toUpperCase();
		let rates = await this.getCurrencyRates(source);
		return rates[target];
	}

	async getCurrencyRates(sourceCurrency: string): Promise<Record<string, number>> {
		const source = sourceCurrency.toUpperCase();
		let data = this.settings.exchangeRateData[source];
		if (!data || !!dayjs().diff(dayjs(data.lastUpdated * 1e3), 'day')) {
			data = await this.fetchExchangeRates(source);
		}
		return data.rates
	}

	async fetchExchangeRates(sourceCurrency: string): Promise<ExchangeRatePluginSettings['exchangeRateData'][string]> {
		try {
			const apiUrl = `https://open.er-api.com/v6/latest/${sourceCurrency}`;
			
			const response = await requestUrl(apiUrl);

			if (response.status === 200 && response.json.result === 'success') {
				const json = response.json as ExchangeRateResponse;
				const data = {
					lastUpdated: json.time_last_update_unix,
					rates: json.rates
				}
				this.settings.exchangeRateData = {
					...this.settings.exchangeRateData,
					[sourceCurrency.toUpperCase()]: data
				}
				await this.saveSettings();
				return data
			} else {
				throw new Error(`API Request Failed: ${response.status}`);
			}
		} catch (error) {
			throw new Error(`Get Exchange Rate Failed: ${error.message}`);
		}
	}
}