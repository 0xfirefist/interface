import { Trans } from '@lingui/macro';
import { Box, Button } from '@mui/material';
import { ListMobileItem } from 'src/components/lists/ListMobileItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { dotify } from './SupplyTransactionListItem';
import { ParsedEvent } from './SupplyTransactionsList';

export const SupplyTransactionMobileListItem = ({ event }: { event: ParsedEvent }) => {
  const { currentNetworkConfig } = useProtocolDataContext();
  const { txhash, amount, iconSymbol, symbol, name } = event;
  return (
    <ListMobileItem symbol={symbol} iconSymbol={iconSymbol} name={name} noLink>
      <Row
        caption={<Trans>Transaction Hash</Trans>}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <Trans>{dotify(txhash, 7)}</Trans>
      </Row>

      <Row caption={<Trans>Amount</Trans>} align="flex-start" captionVariant="description" mb={2}>
        <FormattedNumber value={amount.toNumber()} visibleDecimals={4} />
      </Row>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 5 }}>
        <Button
          variant="contained"
          onClick={() => open(currentNetworkConfig.explorerLink + '/tx/' + txhash)}
        >
          <Trans>Explorer</Trans>
        </Button>
      </Box>
    </ListMobileItem>
  );
};
