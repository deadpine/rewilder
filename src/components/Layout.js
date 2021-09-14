import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
  Flex,
  Link,
  SimpleGrid,
} from "@chakra-ui/react";
import config from "../config"
import { useEthers, useNotifications, getChainName, getExplorerTransactionLink } from "@usedapp/core";
import NextLink from "next/link";
import React from "react";
import ConnectWallet from "./ConnectWallet";
import WalletInfo from "./WalletInfo";
import Head from "./Head";
import truncateHash from "../lib/truncateHash";

// Title text for the various transaction notifications.
const TRANSACTION_TITLES = {
  transactionStarted: "Transaction Sent to Network",
  transactionSucceed: "Transaction Completed",
};

const Layout = ({ children, ...customMeta }) => {
  const { account, error, chainId} = useEthers();
  const { notifications } = useNotifications();

  const incorrectNetwork = error && error.name == 'UnsupportedChainIdError' || 
    (chainId && chainId != config.chainId);

  return (
    <>
      <Head {...customMeta} />
      <header>
        <Container maxWidth="container.xl">
          {
            incorrectNetwork && 
              <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Network selected in wallet ({getChainName(chainId)}, id: {chainId}) unsupported,
                please change to {config.networkName}.</AlertTitle>
              </Alert>
          }
          <SimpleGrid
            columns={[1, 1, 1, 2]}
            alignItems="center"
            justifyContent="space-between"
            py="8"
          >
            <Flex py={[4, null, null, 0]}>
              <NextLink href="/" passHref>
                <Link px="4" py="1">
                  Home
                </Link>
              </NextLink>
              <NextLink href="/nfts" passHref>
                <Link px="4" py="1">
                  NFTs
                </Link>
              </NextLink>
            </Flex>
            {account ? (
              <WalletInfo />
            ) : (
              <ConnectWallet />
            )}
          </SimpleGrid>
        </Container>
      </header>
      <main>
        <Container maxWidth="container.xl">
          {children}
          {notifications.map((notification) => {
            if (notification.type === "walletConnected") {
              return null;
            }
            return (
              <Alert
                key={notification.id}
                status="success"
                position="fixed"
                bottom="8"
                right="8"
                width="400px"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {TRANSACTION_TITLES[notification.type]}
                  </AlertTitle>
                  <AlertDescription overflow="hidden">
                    <Link 
                      href={getExplorerTransactionLink(notification.transaction.hash, config.chainId)}
                      target="_blank"
                    >
                      View on Explorer ({truncateHash(notification.transaction.hash, 61)})
                    </Link>
                  </AlertDescription>
                </Box>
              </Alert>
            );
          })}
        </Container>
      </main>
    </>
  );
};

export default Layout;
