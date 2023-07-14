import { ServerRespond } from './DataStreamer';

export interface Row {  //new row interface for new defined schema for the table
  price_abc: number,
  price_def: number,
  ratio: number,
  upperBound: number,
  lowerBound: number,
  trigger_alert: number | undefined,  
  timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {//this methods return type is defined as Row interface
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;  //price of stock ABC
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;  //price of stock DEF
    const ratio = priceABC / priceDEF;  //ratio of stock ABC and DEF
    const upperBound = 1 + 0.03;  //upper bound of ratio
    const lowerBound = 1 - 0.03;  //lower bound of ratio
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio: ratio,
        upperBound: upperBound,
        lowerBound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,  //trigger alert if ratio is greater than upper bound or lower than lower bound
        timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,  //timestamp of the latest stock price
      };
  }
}
