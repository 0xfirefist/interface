import { Box, Divider, Skeleton, Typography } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { CustomMarket } from 'src/ui-config/marketsConfig';

import { Link, ROUTES } from '../primitives/Link';
import { TokenIcon } from '../primitives/TokenIcon';

interface ListMobileItemProps {
  warningComponent?: ReactNode;
  children: ReactNode;
  symbol?: string;
  iconSymbol?: string;
  name?: string;
  underlyingAsset?: string;
  loading?: boolean;
  currentMarket?: CustomMarket;
  noLink?: boolean;
}

export const ListMobileItem = ({
  children,
  warningComponent,
  symbol,
  iconSymbol,
  name,
  underlyingAsset,
  loading,
  currentMarket,
  noLink,
}: ListMobileItemProps) => {
  return (
    <Box>
      <Divider />

      <Box sx={{ px: 4, pt: 4, pb: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ ml: 2 }}>
                <Skeleton width={100} height={24} />
              </Box>
            </Box>
          ) : (
            symbol &&
            name &&
            iconSymbol &&
            (noLink ? (
              <AssetTitle iconSymbol={iconSymbol} name={name} symbol={symbol} />
            ) : (
              underlyingAsset &&
              currentMarket && (
                <AddLink underlyingAsset={underlyingAsset} currentMarket={currentMarket}>
                  <AssetTitle iconSymbol={iconSymbol} name={name} symbol={symbol} />
                </AddLink>
              )
            ))
          )}

          {warningComponent}
        </Box>

        {children}
      </Box>
    </Box>
  );
};

interface AddLinkProps {
  children: ReactNode;
  underlyingAsset: string;
  currentMarket: CustomMarket;
}
function AddLink({ children, underlyingAsset, currentMarket }: AddLinkProps): ReactElement {
  return (
    <Link
      href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
      sx={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {children}
    </Link>
  );
}

interface AssetTitleItemProps {
  symbol: string;
  iconSymbol: string;
  name: string;
}
function AssetTitle({ iconSymbol, name, symbol }: AssetTitleItemProps): ReactElement {
  return (
    <>
      <TokenIcon symbol={iconSymbol} sx={{ fontSize: '40px' }} />
      <Box sx={{ ml: 2 }}>
        <Typography variant="h4">{name}</Typography>
        <Typography variant="subheader2" color="text.muted">
          {symbol}
        </Typography>
      </Box>
    </>
  );
}
