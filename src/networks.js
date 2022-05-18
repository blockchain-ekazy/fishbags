export const networks = {
  Polygon: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
  Arbitrum: {
    chainId: `0x${Number(421611).toString(16)}`,
    chainName: "",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://testnet.arbiscan.io/"],
  },
  Optimism: {
    chainId: `0x${Number(69).toString(16)}`,
    chainName: "",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://kovan.optimism.io/"],
    blockExplorerUrls: ["https://kovan-optimistic.etherscan.io/"],
  },
};
