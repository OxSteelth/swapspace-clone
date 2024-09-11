
interface AllQueryParams {
  from: string;
  to: string;
  fromChain: string;
  toChain: string;
  amount: string;
  amountTo: string;
}

export type QueryParams = {
  P?: string[];
} & Partial<AllQueryParams>;
