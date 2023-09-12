export interface Signal {
  fromId: SessionId;
  toId: SessionId;
  type: SignalType;
  data: any;
}
export enum SignalType {
  OfferRequest = 'OFFER_REQUEST',
  Offer = 'OFFER',
  Answer = 'ANSWER',
  Candidate = 'CANDIDATE',
  Disconnect = 'DISCONNECT',
}
export type SessionId = string | null;
// export interface Signal {
//   from: string;
//   sendToId: string;
//   to: string;
//   type: SignalType;
//   data: any;
// }
