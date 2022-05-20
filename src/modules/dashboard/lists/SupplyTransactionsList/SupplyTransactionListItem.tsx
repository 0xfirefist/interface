import { Trans } from '@lingui/macro';
import { Button, Tooltip, Typography } from '@mui/material';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListItem } from 'src/components/lists/ListItem';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { ListValueColumn } from '../ListValueColumn';
import { ParsedEvent } from './SupplyTransactionsList';

export const SupplyTransactionListItem = ({ event }: { event: ParsedEvent }) => {
  const { currentNetworkConfig } = useProtocolDataContext();
  const { txhash, amount, iconSymbol, symbol, name } = event;
  return (
    <ListItem>
      <ListColumn maxWidth={160} isRow>
        <TokenIcon symbol={iconSymbol} fontSize="large" />
        <Tooltip title={`${name} (${symbol})`} arrow placement="top">
          <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
            {symbol}
          </Typography>
        </Tooltip>
      </ListColumn>

      <ListColumn>
        <Trans>{dotify(txhash, 7)}</Trans>
      </ListColumn>

      <ListColumn>
        <ListValueColumn value={amount.toNumber()} />
      </ListColumn>

      <ListColumn>
        <Button
          variant="contained"
          onClick={() => open(currentNetworkConfig.explorerLink + '/tx/' + txhash)}
        >
          <Trans>Explorer</Trans>
        </Button>
      </ListColumn>
    </ListItem>
  );
};

export function dotify(txHash: string, charSize: number): string {
  return (
    txHash.slice(0, charSize) + '....' + txHash.slice(txHash.length - charSize - 1, txHash.length)
  );
}
