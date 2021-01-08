import React from 'react';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import PerfectScrollbar from 'perfect-scrollbar';
import moment from 'moment';

const mapStateToProps = (state) => {
  return {
    tradeHistory: state.market.get('tradeHistory'),
    currentMarket: state.market.getIn(['markets', 'currentMarket'])
  };
};

class TradeHistory extends React.PureComponent {
  componentDidUpdate(prevProps) {
    const { tradeHistory } = this.props;
    if (tradeHistory !== prevProps.tradeHistory) {
      this.ps.update();
    }
  }

  render() {
    const { tradeHistory, currentMarket } = this.props;
    return (
      <div
        className="trade-history flex-1 position-relative overflow-hidden border ml-2 mb-2"
        ref={(ref) => this.setRef(ref)}>
        <table className="table">
          <thead>
            <tr>
              <th className="font-weight-bold">Time</th>
              <th className="text-right font-weight-bold">Price</th>
              <th className="text-right font-weight-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory
              .toArray()
              .reverse()
              .slice(0, 16)
              .map(([id, trade], idx) => {
                const colorGreen = trade.takerSide === 'buy';
                return (
                  <tr key={trade.id} className={`${idx % 2 === 0 ? 'bg-blueishWhite' : ''}`}>
                    <td className="text-secondary">{moment(trade.executedAt).format('HH:mm:ss')}</td>
                    <td className={['text-right', colorGreen ? 'text-success' : 'text-danger'].join(' ')}>
                      {new BigNumber(trade.price).toFixed(currentMarket.priceDecimals)}
                      {trade.takerSide === 'buy' ? (
                        <i className="fa fa-arrow-up" aria-hidden="true" />
                      ) : (
                        <i className="fa fa-arrow-down" aria-hidden="true" />
                      )}
                    </td>
                    <td className="text-right">{new BigNumber(trade.amount).toFixed(currentMarket.amountDecimals)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }

  setRef(ref) {
    if (ref) {
      this.ps = new PerfectScrollbar(ref, {
        suppressScrollX: true,
        maxScrollbarLength: 20
      });
    }
  }
}

export default connect(mapStateToProps)(TradeHistory);
