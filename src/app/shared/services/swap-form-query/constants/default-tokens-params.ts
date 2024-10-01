
export const defaultFormParameters = {
  swap: {
    fromChain: 'bep20',
    toChain: 'bep20',
    from: 'bnb',
    to: 'usdt',
    amount: '0.1'
  }
};

export type DefaultParametersFrom = keyof typeof defaultFormParameters.swap.from;
export type DefaultParametersTo = keyof typeof defaultFormParameters.swap.to;
