export interface Currency {
    name: string;
    icon: string;
    deposit: boolean;
    withdrawal: boolean;
    code: string;
    network: string;
    id: string;
    popular: boolean;
    networkName: string;
    validationRegexp?: string;
    hasExtraId: boolean;
    extraIdName?: string;
}
