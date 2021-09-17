import React from "react";
import { DAppProvider } from "@usedapp/core";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import "./../lib/analytics.js";
import config from "../config.js";
import { addressFor } from "../lib/addresses";

// css
import '../../public/assets/css/bootstrap.min.css';
import '../../public/assets/css/variables.css';
import '../../public/assets/css/style.css';
import '../../public/assets/css/main.css';


// required for dev networks
config.DAppProviderConfig.multicallAddresses[config.chainId] = addressFor("Multicall")

export const queryClient = new QueryClient();

// TODO: delete this messages for prod
console.log(`NEXT_PUBLIC_REWILDER_ENV = ${process.env.NEXT_PUBLIC_REWILDER_ENV}`);
console.log(`Configuring app in ${config.networkName} network, id = ${config.chainId}.`)
console.log(`multicallAddresses = ${config.DAppProviderConfig.multicallAddresses[config.chainId]}`);

const MyApp = ({ Component, pageProps }) => {
  return (
    <DAppProvider config={config.DAppProviderConfig}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.reactQueryState}>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </Hydrate>
      </QueryClientProvider>
    </DAppProvider>
  );
};

export default MyApp;
