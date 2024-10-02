export interface Trade {
    from_address: string;
    provider: string;
    from_network: string;
    to_network: string;
    source_transaction: {
        hash: string;
        status: string;
        explorer_url: string;
    };
    destination_transaction: {
        hash: string;
        status: string;
        explorer_url: string;
    };
    from_token: {
        symbol: string;
        decimals: number;
        logo_url: string;
    };
    to_token: {
        symbol: string;
        decimals: number;
        logo_url: string;
    };
    from_amount: number;
    to_amount: number;
    timestamp: string;
    status: string;
}

export interface RecentTrade {
    date: number;
    amount: number;
    fromCurrency: string;
    toCurrency: string;
}
