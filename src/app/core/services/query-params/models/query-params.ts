interface AllQueryParams {
  from: string;
  to: string;
  fromChain: string;
  toChain: string;
  amount: string;
  amountTo: string;
  direction: string;
  partner: string;
  fixed: boolean;
}

export type QueryParams = {
  P?: string[];
} & Partial<AllQueryParams>;
