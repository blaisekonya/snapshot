const projectId = 'cc8fce167e9b87d538f58ac46a9f30ba';

const connectors = {
  walletlink: {
    id: 'walletlink',
    name: 'Coinbase',
    network: '8453',
    options: {
      appName: 'World Association',
      chainId: 8453,
      darkMode: false,
      jsonRpcUrl: `https://rpc.walletconnect.org/v1/?chainId=eip155:8453&projectId=${projectId}`,
      enableMobileWalletLink: true,
      overrideIsCoinbaseBrowser: true,
      overrideIsCoinbaseWallet: true,
      overrideIsMetaMask: true,
      headlessMode: true,
      preference: 'all'
    },
    icon: 'ipfs://QmbJKEaeMz6qR3DmJSTxtYtrZeQPptVfnnYK72QBsvAw5q',
    hidden: false
  },
  injected: {
    id: 'injected',
    name: 'MetaMask',
    network: '8453',
    hidden: true
  },
  walletconnect: {
    id: 'walletconnect',
    name: 'WalletConnect',
    network: '8453',
    options: {
      projectId: 'cc8fce167e9b87d538f58ac46a9f30ba',
      chains: [],
      optionalChains: [
        1, 4, 5, 10, 42, 56, 100, 137, 246, 250, 4002, 1088, 42161, 73799,
        11155111
      ],
      optionalMethods: [
        'eth_sendTransaction',
        'personal_sign',
        'eth_accounts',
        'eth_signTypedData_v4'
      ],
      rpcMap: {
        '1': `https://rpc.walletconnect.org/v1/?chainId=eip155:1&projectId=${projectId}`,
        '4': `https://rpc.walletconnect.org/v1/?chainId=eip155:4&projectId=${projectId}`,
        '5': `https://rpc.walletconnect.org/v1/?chainId=eip155:5&projectId=${projectId}`,
        '10': `https://rpc.walletconnect.org/v1/?chainId=eip155:10&projectId=${projectId}`,
        '42': `https://rpc.walletconnect.org/v1/?chainId=eip155:42&projectId=${projectId}`,
        '56': `https://rpc.walletconnect.org/v1/?chainId=eip155:56&projectId=${projectId}`,
        '100': `https://rpc.walletconnect.org/v1/?chainId=eip155:100&projectId=${projectId}`,
        '137': `https://rpc.walletconnect.org/v1/?chainId=eip155:137&projectId=${projectId}`,
        '246': `https://rpc.walletconnect.org/v1/?chainId=eip155:246&projectId=${projectId}`,
        '8453': `https://rpc.walletconnect.org/v1/?chainId=eip155:8453&projectId=${projectId}`,
        '42161': `https://rpc.walletconnect.org/v1/?chainId=eip155:42161&projectId=${projectId}`,
        '73799': `https://rpc.walletconnect.org/v1/?chainId=eip155:73799&projectId=${projectId}`,
        '11155111': `https://rpc.walletconnect.org/v1/?chainId=eip155:11155111&projectId=${projectId}`
      },
      showQrModal: true
    },
    icon: 'ipfs://QmZRVqHpgRemw13aoovP2EaQdVtjzXRaQGQZsCLXWaNn9x',
    hidden: true
  },
  portis: {
    id: 'portis',
    name: 'Portis',
    network: '1',
    options: {
      dappId: '3eb93706-c71d-456b-b4eb-322ea27f7d48',
      network: 'mainnet'
    },
    icon: 'ipfs://QmNuLXa47xSrDNKRfpPNhoFTuoztvtWCcwGnPpT5MXJWMb',
    hidden: true
  },
  stargazer: {
    id: 'stargazer',
    name: 'Stargazer',
    icon: 'ipfs://bafkreiapdizo36f3yeg7g6l46f7ahbbkyo4otufnfyqri6louysr3grpzy',
    hidden: true
  },
  gnosis: {
    id: 'gnosis',
    name: 'Gnosis Safe',
    icon: 'ipfs://QmfJUHZLtRvadM7fvEJUWWxhS869KXXCMxPCr7TUqkwvUc',
    hidden: true
  },
  kaikas: {
    id: 'kaikas',
    name: 'Kaikas',
    icon: 'ipfs://QmXD4kkxKzXKbbBu3zAzZ279Sm91JhxCDAwSypyzxwe2Hj',
    hidden: true
  }
};

export default connectors;
