import { Trans } from '@lingui/macro';
import { ethers, BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { IPool__factory } from '@aave/contract-helpers/dist/cjs/v3-pool-contract/typechain/IPool__factory';
import { Event } from '@ethersproject/contracts';
import { DashboardContentNoData } from '../../DashboardContentNoData';
import { SupplyTransactionListItem } from './SupplyTransactionListItem';
import { ListHeader } from '../ListHeader';
import { ListLoader } from '../ListLoader';
import { JsonRpcProvider } from '@ethersproject/providers';
import { erc20_abi } from './erc20_abi';
import { fetchIconSymbolAndName } from 'src/ui-config/reservePatches';
import { useMediaQuery, useTheme } from '@mui/material';
import { SupplyTransactionMobileListItem } from './SupplyTransactionMobileListItem';

export const SupplyTransactionsList = () => {
  // user account address to be used in event filters
  const { currentAccount, provider } = useWeb3Context();

  // get lending pool address from current market data
  const { currentMarketData } = useProtocolDataContext();
  // note
  // const { jsonRpcProvider } = useProtocolDataContext();
  // I am not able to use jsonRpcProvider from protocol data context due to cors error.
  // question - is this the same provider? if yes, why do you use a separate provider.

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Array<ParsedEvent>>();

  // support for mobile theme
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  useEffect(() => {
    (async () => {
      try {
        if (provider === undefined) return;

        setLoading(true);
        // pool on which to filter events
        const pool = currentMarketData.addresses.LENDING_POOL;

        // needed an abi to instantiate it
        // found it in IPool__factory
        const pool_contract = new ethers.Contract(pool, IPool__factory.abi, provider);

        // create filter for current user
        // checking for the supply event
        const filter = pool_contract.filters.Supply(null, null, currentAccount);

        // query events using above filters
        const events = await pool_contract.queryFilter(filter);
        const parsedEvents = await parseEvents(provider, events);
        setEvents(parsedEvents);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentAccount, currentMarketData, provider]);

  // tried to reuse logic from this repo for lists and all
  const head = [<Trans key="Tx Hash">Tx Hash</Trans>, <Trans key="Amount">Amount</Trans>];

  if (loading)
    return <ListLoader title={<Trans>Last 5 transactions</Trans>} head={head} withTopMargin />;

  return (
    <ListWrapper
      title={<Trans>Last 5 transactions</Trans>}
      withTopMargin
      localStorageName="supplyAssetsTransactionHistoryTableCollapse"
    >
      <>
        {/* {!downToXSM && <ListHeader head={head} />}
        {supplyReserves.map((item) =>
          downToXSM ? (
            <SupplyAssetsListMobileItem {...item} key={item.id} />
          ) : (
            <SupplyAssetsListItem {...item} key={item.id} />
          )
        )} */}

        {!downToXSM && <ListHeader head={head} />}
        {events === undefined ? (
          <DashboardContentNoData text={<Trans>Error fetching events</Trans>} />
        ) : events.length === 0 ? (
          <DashboardContentNoData text={<Trans>No transaction history</Trans>} />
        ) : (
          events.map((event) =>
            !downToXSM ? (
              <SupplyTransactionListItem event={event} key={event.txhash} />
            ) : (
              <SupplyTransactionMobileListItem event={event} key={event.txhash} />
            )
          )
        )}
      </>
    </ListWrapper>
  );
};

export type ParsedEvent = {
  iconSymbol: string;
  name: string;
  symbol: string;
  amount: BigNumber;
  txhash: string;
};

async function parseEvents(
  provider: JsonRpcProvider,
  events: Array<Event>
): Promise<Array<ParsedEvent>> {
  const parsedEvents = await Promise.all(
    events.map(async (event) => {
      const underlyingAsset = event.args && event.args.reserve;

      // need to get the following details for a given asset
      // symbol - to fetch icon symbol and name
      // decimals - use it to convert amount
      const contract = new ethers.Contract(underlyingAsset, erc20_abi, provider);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();

      const tokenInfo = fetchIconSymbolAndName({ underlyingAsset, symbol: symbol as string });

      const amount = event.args && (event.args[3] as BigNumber);
      return {
        amount: amount?.div(BigNumber.from(10).pow(decimals)) || BigNumber.from(0),
        ...tokenInfo,
        txhash: event.transactionHash,
      };
    })
  );

  return parsedEvents;
}
