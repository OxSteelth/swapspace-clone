
export const defaultFormParameters = {
  swap: {
    fromChain: 'btc',
    toChain: 'eth',
    from: 'btc',
    to: 'eth',
    amount: '1'
  }
};

export type DefaultParametersFrom = keyof typeof defaultFormParameters.swap.from;
export type DefaultParametersTo = keyof typeof defaultFormParameters.swap.to;
