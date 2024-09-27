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
  id: string;
}

export type QueryParams = {
  P?: string[];
} & Partial<AllQueryParams>;
