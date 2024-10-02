import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { BehaviorSubject, from, fromEvent, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import BigNumber from 'bignumber.js';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: Web3 | undefined;
  private accounts: string[] = [];
  private accountsSubject = new Subject<string[]>();
  public ethereum;
  private _currentNetwork$ = new BehaviorSubject<string | null>(null);
  public currentNetwork$: Observable<string | null> = this._currentNetwork$.asObservable();

  constructor() {
    const { ethereum } = <any>window;
    this.ethereum = ethereum;

    this.initializeWeb3();
  }

  // Initialize Web3 and set up account observable
  private async initializeWeb3() {
    if (this.ethereum) {
      this.web3 = new Web3(this.ethereum);
      this.setupNetworkListener();
      await this.getNetworkInfo();
      try {
        await this.ethereum.request({ method: 'eth_requestAccounts' });
        this.accounts = await this.web3.eth.getAccounts();
        this.accountsSubject.next(this.accounts);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.error('No Ethereum provider found. Please install MetaMask!');
    }
  }

  // Observable for accounts
  public getAccountsObservable(): Observable<string[]> {
    return this.accountsSubject.asObservable();
  }

  // Get balance as an observable
  public getBalance(address: string): Observable<string> {
    if (!this.web3) {
      return new Observable(observer => {
        observer.error('Web3 not initialized');
      });
    }

    return from(this.web3.eth.getBalance(address)).pipe(
      map(balance => this.web3!.utils.fromWei(balance, 'ether')),
      catchError(error => {
        console.error('Error getting balance', error);
        throw error;
      })
    );
  }

  public getNativeTokenDecimals(network: string): number {
    switch (network) {
      case 'ethereum':
      case 'binance':
        return 18; // Ether (ETH) and BNB both have 18 decimals
      case 'solana':
        return 9; // Solana (SOL) has 9 decimals
      case 'bitcoin':
        return 8; // Bitcoin (BTC) has 8 decimals
      case 'polkadot':
        return 10; // Polkadot (DOT) has 10 decimals
      case 'cardano':
      case 'ripple':
        return 6; // Cardano (ADA) and Ripple (XRP) have 6 decimals
      default:
        throw new Error('Unknown network');
    }
  }

  public getChecksumAddress(address: string): string {
    return this.web3.utils.toChecksumAddress(address);
  }

  public sendTransaction(fromAddr: string, to: string, amount: string): Observable<any> {
    if (!this.web3) {
      return new Observable(observer => {
        observer.error('Web3 not initialized');
      });
    }

    const transactionParams = {
      from: fromAddr,
      to,
      value: this.web3.utils.toWei(amount, 'ether'),
      gas: '21000'
    };

    return from(this.web3.eth.sendTransaction(transactionParams)).pipe(
      catchError(error => {
        console.error('Error sending transaction', error);
        throw error;
      })
    );
  }

  public sendTokenTransaction(
    fromAddr: string,
    to: string,
    amount: string,
    contractAddress: string
  ): Observable<any> {
    if (!this.web3) {
      return new Observable(observer => {
        observer.error('Web3 not initialized');
      });
    }

    const abi = [
      {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_value', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function'
      },
      {
        constant: true,
        inputs: [] as any[],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      }
    ];

    const contract = this.getContract(abi, contractAddress);

    return contract.methods
      .decimals()
      .call()
      .then((decimals: number) => {
        const toWei = (Number(amount) * Math.pow(10, decimals)).toFixed();
        const weiValue = this.web3.utils.toWei(toWei, 'wei');

        contract.methods
          .transfer(to, weiValue)
          .estimateGas({ from: fromAddr })
          .then((gasAmount: number) => {
            return from(
              contract.methods.transfer(to, weiValue).send({ from: fromAddr, gas: gasAmount })
            ).pipe(
              catchError(error => {
                console.error('Error sending transaction', error);
                throw error;
              })
            );
          })
          .catch(() => {
            return new Observable(observer => {
              observer.error('estimating gas failed');
            });
          });
      })
      .catch((error: any) => {
        return new Observable(observer => {
          observer.error('getting decimals error');
        });
      });
  }

  // Sign a message as an observable
  public signMessage(account: string, message: string): Observable<string> {
    if (!this.web3) {
      return new Observable(observer => {
        observer.error('Web3 not initialized');
      });
    }

    return from(this.web3.eth.personal.sign(message, account, '')).pipe(
      catchError(error => {
        console.error('Error signing message', error);
        throw error;
      })
    );
  }

  // Interact with a contract as an observable
  public getContract(abi: any, address: string): any {
    if (!this.web3) {
      throw new Error('Web3 not initialized');
    }
    return new this.web3.eth.Contract(abi, address);
  }

  public isZeroAddress(address: string) {
    return address.toLowerCase() === '0x0000000000000000000000000000000000000000';
  }

  switchNetwork(chainId: string): Observable<any> {
    if (!(window as any).ethereum) {
      return new Observable(observer => {
        observer.error('MetaMask is not installed');
      });
    }

    const params = [{ chainId }]; // Chain ID in hexadecimal (e.g., '0x1' for Ethereum Mainnet)

    return from(
      (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params
      })
    ).pipe(
      catchError(error => {
        // If the network is not available, prompt the user to add it
        if (error.code === 4902) {
          return this.addNetwork(chainId); // Call addNetwork method to add the chain
        }

        return new Observable(observer => {
          observer.error('Error switching network' + error.message);
        });
      })
    );
  }

  // Add a network to MetaMask if it’s not available
  addNetwork(chainId: string): Observable<any> {
    const networkData = this.getNetworkParams(chainId);

    if (!networkData) {
      return new Observable(observer => {
        observer.error('Network parameters not found');
      });
    }

    return from(
      (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkData]
      })
    ).pipe(
      catchError(error => {
        console.error('Error adding network: ', error.message);

        throw error;
      })
    );
  }

  public getChainIdFromNetwork(network: string) {
    const networkToChainId: { [key: string]: string } = {
      bep20: '0x38',
      eth: '0x1'
    };

    return networkToChainId[network] || null;
  }

  // Network parameters for adding a custom chain
  private getNetworkParams(chainId: string) {
    const networkParams: { [key: string]: any } = {
      '0x38': {
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com']
      },
      '0x1': {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io']
      },
      '0xa4b1': {
        chainId: '0xa4b1',
        chainName: 'Arbitrum One',
        nativeCurrency: {
          name: 'Arbitrum',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io/']
      },
      '0xa86a': {
        chainId: '0xa86a',
        chainName: 'Avalanche C-Chain',
        nativeCurrency: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18
        },
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://snowtrace.io/']
      },
      '0x89': {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      },
      '0x44D': {
        chainId: '0x44D',
        chainName: 'Polygon zkEVM',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://zkevm-rpc.com'],
        blockExplorerUrls: ['https://zkevm.polygonscan.com']
      },
      '0xfa': {
        chainId: '0xfa',
        chainName: 'Fantom Opera',
        nativeCurrency: {
          name: 'Fantom',
          symbol: 'FTM',
          decimals: 18
        },
        rpcUrls: ['https://rpc.fantom.network/'],
        blockExplorerUrls: ['https://ftmscan.com/']
      },
      '0x1F4': {
        chainId: '0x1F4',
        chainName: 'Blast Network',
        nativeCurrency: {
          name: 'Blast',
          symbol: 'BLAST',
          decimals: 18
        },
        rpcUrls: ['https://rpc.blast.network'],
        blockExplorerUrls: ['https://explorer.blast.network']
      },
      '0xa': {
        chainId: '0xa',
        chainName: 'Optimism',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.optimism.io'],
        blockExplorerUrls: ['https://optimistic.etherscan.io']
      },
      '0x141': {
        chainId: '0x141',
        chainName: 'KuCoin Community Chain (KCC)',
        nativeCurrency: {
          name: 'KuCoin Token',
          symbol: 'KCS',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mainnet.kcc.network'],
        blockExplorerUrls: ['https://explorer.kcc.io']
      },
      '0xa4ec': {
        chainId: '0xa4ec',
        chainName: 'Celo Mainnet',
        nativeCurrency: {
          name: 'Celo',
          symbol: 'CELO',
          decimals: 18
        },
        rpcUrls: ['https://forno.celo.org'],
        blockExplorerUrls: ['https://explorer.celo.org']
      },
      '0x504': {
        chainId: '0x504',
        chainName: 'Moonbeam',
        nativeCurrency: {
          name: 'Glimmer',
          symbol: 'GLMR',
          decimals: 18
        },
        rpcUrls: ['https://rpc.api.moonbeam.network'],
        blockExplorerUrls: ['https://moonscan.io']
      },
      '0x505': {
        chainId: '0x505',
        chainName: 'Moonriver',
        nativeCurrency: {
          name: 'Moonriver',
          symbol: 'MOVR',
          decimals: 18
        },
        rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
        blockExplorerUrls: ['https://moonriver.moonscan.io']
      },
      '0x2329': {
        chainId: '0x2329',
        chainName: 'Evmos',
        nativeCurrency: {
          name: 'Evmos',
          symbol: 'EVMOS',
          decimals: 18
        },
        rpcUrls: ['https://evmos-evm.rpc.evmos.org'],
        blockExplorerUrls: ['https://evm.evmos.org']
      },
      '0x19': {
        chainId: '0x19',
        chainName: 'Cronos Mainnet',
        nativeCurrency: {
          name: 'Cronos',
          symbol: 'CRO',
          decimals: 18
        },
        rpcUrls: ['https://evm-cronos.crypto.org'],
        blockExplorerUrls: ['https://cronoscan.com']
      },
      '0x28': {
        chainId: '0x28',
        chainName: 'Telos EVM',
        nativeCurrency: {
          name: 'Telos',
          symbol: 'TLOS',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.telos.net/evm'],
        blockExplorerUrls: ['https://teloscan.io']
      },
      '0x80': {
        chainId: '0x80',
        chainName: 'Huobi ECO Chain Mainnet',
        nativeCurrency: {
          name: 'Huobi Token',
          symbol: 'HT',
          decimals: 18
        },
        rpcUrls: ['https://http-mainnet.hecochain.com'],
        blockExplorerUrls: ['https://hecoinfo.com']
      },
      '0x63564C40': {
        chainId: '0x63564C40',
        chainName: 'Harmony Mainnet',
        nativeCurrency: {
          name: 'ONE',
          symbol: 'ONE',
          decimals: 18
        },
        rpcUrls: ['https://api.harmony.one'],
        blockExplorerUrls: ['https://explorer.harmony.one']
      },
      '0x4E454152': {
        chainId: '0x4E454152',
        chainName: 'Aurora Mainnet',
        nativeCurrency: {
          name: 'Aurora',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.aurora.dev'],
        blockExplorerUrls: ['https://aurorascan.dev']
      },
      '0x42': {
        chainId: '0x42',
        chainName: 'OKX Chain',
        nativeCurrency: {
          name: 'OKT',
          symbol: 'OKT',
          decimals: 18
        },
        rpcUrls: ['https://exchainrpc.okex.org'],
        blockExplorerUrls: ['https://www.oklink.com/okexchain']
      },
      '0x64': {
        chainId: '0x64',
        chainName: 'Gnosis',
        nativeCurrency: {
          name: 'xDAI',
          symbol: 'xDAI',
          decimals: 18
        },
        rpcUrls: ['https://rpc.gnosischain.com'],
        blockExplorerUrls: ['https://blockscout.com/xdai/mainnet']
      },
      '0x7A': {
        chainId: '0x7A',
        chainName: 'Fuse',
        nativeCurrency: {
          name: 'Fuse',
          symbol: 'FUSE',
          decimals: 18
        },
        rpcUrls: ['https://rpc.fuse.io'],
        blockExplorerUrls: ['https://explorer.fuse.io']
      },
      '0x120': {
        chainId: '0x120',
        chainName: 'Boba Network',
        nativeCurrency: {
          name: 'Boba Token',
          symbol: 'BOBA',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.boba.network'],
        blockExplorerUrls: ['https://blockexplorer.boba.network']
      },
      '0xDBE0': {
        chainId: '0xDBE0',
        chainName: 'Boba BNB',
        nativeCurrency: {
          name: 'Boba BNB',
          symbol: 'BOBA',
          decimals: 18
        },
        rpcUrls: ['https://bsc.boba.network'],
        blockExplorerUrls: ['https://bobabnb.bobascan.com']
      },
      '0x250': {
        chainId: '0x250',
        chainName: 'Astar EVM',
        nativeCurrency: {
          name: 'Astar',
          symbol: 'ASTR',
          decimals: 18
        },
        rpcUrls: ['https://evm.astar.network'],
        blockExplorerUrls: ['https://astar.subscan.io']
      },
      '0x2711': {
        chainId: '0x2711',
        chainName: 'ETHW (EthereumPoW)',
        nativeCurrency: {
          name: 'EthereumPoW',
          symbol: 'ETHW',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.ethwscan.com'],
        blockExplorerUrls: ['https://ethwscan.com']
      },
      '0x8AE': {
        chainId: '0x8AE',
        chainName: 'Kava EVM',
        nativeCurrency: {
          name: 'KAVA',
          symbol: 'KAVA',
          decimals: 18
        },
        rpcUrls: ['https://evm.kava.io'],
        blockExplorerUrls: ['https://explorer.kava.io']
      },
      '0x7F08': {
        chainId: '0x7F08',
        chainName: 'Bitgert',
        nativeCurrency: {
          name: 'Bitgert',
          symbol: 'BRISE',
          decimals: 18
        },
        rpcUrls: ['https://mainnet-rpc.brisescan.com'],
        blockExplorerUrls: ['https://brisescan.com']
      },
      '0xA516': {
        chainId: '0xA516',
        chainName: 'Oasis Emerald',
        nativeCurrency: {
          name: 'ROSE',
          symbol: 'ROSE',
          decimals: 18
        },
        rpcUrls: ['https://emerald.oasis.dev'],
        blockExplorerUrls: ['https://explorer.emerald.oasis.dev']
      },
      '0x440': {
        chainId: '0x440',
        chainName: 'Metis Andromeda',
        nativeCurrency: {
          name: 'Metis',
          symbol: 'METIS',
          decimals: 18
        },
        rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
        blockExplorerUrls: ['https://andromeda-explorer.metis.io']
      },
      '0xD2AF': {
        chainId: '0xD2AF',
        chainName: 'DeFi Kingdoms',
        nativeCurrency: {
          name: 'Jewel',
          symbol: 'JEWEL',
          decimals: 18
        },
        rpcUrls: ['https://subnets.avax.network/defi-kingdoms'],
        blockExplorerUrls: ['https://explorer.dfkchain.com']
      },
      '0x2019': {
        chainId: '0x2019',
        chainName: 'Klaytn',
        nativeCurrency: {
          name: 'Klaytn',
          symbol: 'KLAY',
          decimals: 18
        },
        rpcUrls: ['https://public-node-api.klaytnapi.com/v1/cypress'],
        blockExplorerUrls: ['https://scope.klaytn.com']
      },
      '0x6A': {
        chainId: '0x6A',
        chainName: 'Velas',
        nativeCurrency: {
          name: 'Velas',
          symbol: 'VLX',
          decimals: 18
        },
        rpcUrls: ['https://evmexplorer.velas.com/rpc'],
        blockExplorerUrls: ['https://evmexplorer.velas.com']
      },
      '0x54': {
        chainId: '0x54',
        chainName: 'Meter',
        nativeCurrency: {
          name: 'Meter',
          symbol: 'MTR',
          decimals: 18
        },
        rpcUrls: ['https://rpc.meter.io'],
        blockExplorerUrls: ['https://scan.meter.io']
      },
      '0x39': {
        chainId: '0x39',
        chainName: 'Syscoin Mainnet',
        nativeCurrency: {
          name: 'Syscoin',
          symbol: 'SYS',
          decimals: 18
        },
        rpcUrls: ['https://rpc.syscoin.org'],
        blockExplorerUrls: ['https://explorer.syscoin.org']
      },
      '0x3D': {
        chainId: '0x3D',
        chainName: 'Ethereum Classic',
        nativeCurrency: {
          name: 'Ethereum Classic',
          symbol: 'ETC',
          decimals: 18
        },
        rpcUrls: ['https://www.etcnode.org'],
        blockExplorerUrls: ['https://blockscout.com/etc/mainnet']
      },
      '0xE': {
        chainId: '0xE',
        chainName: 'Flare Mainnet',
        nativeCurrency: {
          name: 'Flare',
          symbol: 'FLR',
          decimals: 18
        },
        rpcUrls: ['https://flare-api.flare.network/ext/C/rpc'],
        blockExplorerUrls: ['https://flare-explorer.flare.network']
      },
      '0x1251': {
        chainId: '0x1251',
        chainName: 'IoTeX Mainnet',
        nativeCurrency: {
          name: 'IoTeX',
          symbol: 'IOTX',
          decimals: 18
        },
        rpcUrls: ['https://rpc.iotex.io'],
        blockExplorerUrls: ['https://iotexscan.io']
      },
      '0x169': {
        chainId: '0x169',
        chainName: 'Theta Mainnet',
        nativeCurrency: {
          name: 'Theta Fuel',
          symbol: 'TFUEL',
          decimals: 18
        },
        rpcUrls: ['https://eth-rpc-api.thetatoken.org/rpc'],
        blockExplorerUrls: ['https://explorer.thetatoken.org']
      },
      '0x2710': {
        chainId: '0x2710',
        chainName: 'Bitcoin Cash SmartBCH',
        nativeCurrency: {
          name: 'Bitcoin Cash',
          symbol: 'BCH',
          decimals: 18
        },
        rpcUrls: ['https://smartbch.fountainhead.cash/mainnet'],
        blockExplorerUrls: ['https://smartscan.cash']
      },
      '0x144': {
        chainId: '0x144',
        chainName: 'zkSync Era Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.era.zksync.io'],
        blockExplorerUrls: ['https://explorer.zksync.io']
      },
      '0x171': {
        chainId: '0x171',
        chainName: 'PulseChain Mainnet',
        nativeCurrency: {
          name: 'Pulse',
          symbol: 'PLS',
          decimals: 18
        },
        rpcUrls: ['https://rpc.pulsechain.com'],
        blockExplorerUrls: ['https://scan.pulsechain.com']
      },
      '0xE708': {
        chainId: '0xE708',
        chainName: 'Linea Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://linea-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'],
        blockExplorerUrls: ['https://explorer.linea.build']
      },
      '0x2105': {
        chainId: '0x2105',
        chainName: 'Base Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.base.org'],
        blockExplorerUrls: ['https://basescan.org']
      },
      '0x1388': {
        chainId: '0x1388',
        chainName: 'Mantle Mainnet',
        nativeCurrency: {
          name: 'Mantle',
          symbol: 'MNT',
          decimals: 18
        },
        rpcUrls: ['https://rpc.mantle.xyz'],
        blockExplorerUrls: ['https://explorer.mantle.xyz']
      },
      '0x34816D': {
        chainId: '0x34816D',
        chainName: 'Manta Pacific',
        nativeCurrency: {
          name: 'Manta',
          symbol: 'MANTA',
          decimals: 18
        },
        rpcUrls: ['https://pacific-rpc.manta.network'],
        blockExplorerUrls: ['https://explorer.pacific.manta.network']
      },
      '0x82751': {
        chainId: '0x82751',
        chainName: 'Scroll Mainnet',
        nativeCurrency: {
          name: 'Scroll',
          symbol: 'SCRL',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.scroll.io'],
        blockExplorerUrls: ['https://scrollscan.io']
      },
      '0x1B59': {
        chainId: '0x1B59',
        chainName: 'ZetaChain Mainnet',
        nativeCurrency: {
          name: 'Zeta',
          symbol: 'ZETA',
          decimals: 18
        },
        rpcUrls: ['https://api.mainnet.zetachain.com'],
        blockExplorerUrls: ['https://explorer.zetachain.com']
      },
      '0x1EC6': {
        chainId: '0x1EC6',
        chainName: 'Blast Mainnet',
        nativeCurrency: {
          name: 'Blast',
          symbol: 'BLAST',
          decimals: 18
        },
        rpcUrls: ['https://rpc.blastapi.io'],
        blockExplorerUrls: ['https://explorer.blastapi.io']
      },
      '0xE11': {
        chainId: '0xE11',
        chainName: 'Kroma Mainnet',
        nativeCurrency: {
          name: 'Kroma',
          symbol: 'KROMA',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.kroma.network'],
        blockExplorerUrls: ['https://explorer.kroma.network']
      },
      '0x388': {
        chainId: '0x388',
        chainName: 'Horizen EON Mainnet',
        nativeCurrency: {
          name: 'ZEN',
          symbol: 'ZEN',
          decimals: 18
        },
        rpcUrls: ['https://eon-rpc.horizen.io'],
        blockExplorerUrls: ['https://explorer.horizen.io']
      },
      '0x652': {
        chainId: '0x652',
        chainName: 'Merlin Mainnet',
        nativeCurrency: {
          name: 'Merlin',
          symbol: 'MER',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.merlin.network'],
        blockExplorerUrls: ['https://explorer.merlin.network']
      },
      '0x1E': {
        chainId: '0x1E',
        chainName: 'Rootstock Mainnet',
        nativeCurrency: {
          name: 'Rootstock',
          symbol: 'RSK',
          decimals: 18
        },
        rpcUrls: ['https://public-node.rsk.co'],
        blockExplorerUrls: ['https://explorer.rsk.co']
      },
      '0xF2': {
        chainId: '0xF2',
        chainName: 'Mode Mainnet',
        nativeCurrency: {
          name: 'Mode',
          symbol: 'MODE',
          decimals: 18
        },
        rpcUrls: ['https://rpc.mode.network'],
        blockExplorerUrls: ['https://explorer.mode.network']
      },
      '0x1E61': {
        chainId: '0x1E61',
        chainName: 'zkFair Mainnet',
        nativeCurrency: {
          name: 'zkFair',
          symbol: 'ZKF',
          decimals: 18
        },
        rpcUrls: ['https://rpc.zkfair.network'],
        blockExplorerUrls: ['https://explorer.zkfair.network']
      },
      '0x7E7': {
        chainId: '0x7E7',
        chainName: 'zkLink Mainnet',
        nativeCurrency: {
          name: 'zkLink',
          symbol: 'ZKL',
          decimals: 18
        },
        rpcUrls: ['https://rpc.zklink.io'],
        blockExplorerUrls: ['https://explorer.zklink.io']
      },
      '0x2694': {
        chainId: '0x2694',
        chainName: 'Xlayer Mainnet',
        nativeCurrency: {
          name: 'Xlayer',
          symbol: 'XLR',
          decimals: 18
        },
        rpcUrls: ['https://rpc.xlayer.network'],
        blockExplorerUrls: ['https://explorer.xlayer.network']
      },
      '0x28C5C': {
        chainId: '0x28C5C',
        chainName: 'Taiko Alpha-3',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://rpc.a3.taiko.xyz'],
        blockExplorerUrls: ['https://explorer.a3.taiko.xyz']
      },
      '0x1ADB0': {
        chainId: '0x1ADB0',
        chainName: 'Sei Mainnet',
        nativeCurrency: {
          name: 'Sei',
          symbol: 'SEI',
          decimals: 18
        },
        rpcUrls: ['https://rpc.mainnet.seinetwork.io'],
        blockExplorerUrls: ['https://explorer.seinetwork.io']
      },
      '0x45C': {
        chainId: '0x45C',
        chainName: 'Core Mainnet',
        nativeCurrency: {
          name: 'Core',
          symbol: 'CORE',
          decimals: 18
        },
        rpcUrls: ['https://rpc.coredao.org'],
        blockExplorerUrls: ['https://scan.coredao.org']
      },
      '0x385': {
        chainId: '0x385',
        chainName: 'Bahamut Mainnet',
        nativeCurrency: {
          name: 'Bahamut',
          symbol: 'BHM',
          decimals: 18
        },
        rpcUrls: ['https://rpc.bahamut.io'],
        blockExplorerUrls: ['https://explorer.bahamut.io']
      },
      '0x23A1': {
        chainId: '0x23A1',
        chainName: 'Bitlayer Mainnet',
        nativeCurrency: {
          name: 'Bitlayer',
          symbol: 'BLT',
          decimals: 18
        },
        rpcUrls: ['https://rpc.bitlayer.network'],
        blockExplorerUrls: ['https://explorer.bitlayer.network']
      },
      '0xF': {
        chainId: '0xF',
        chainName: 'Gravity Mainnet',
        nativeCurrency: {
          name: 'GRAV',
          symbol: 'GRAV',
          decimals: 18
        },
        rpcUrls: ['https://rpc.gravity.io'],
        blockExplorerUrls: ['https://explorer.gravity.io']
      },
      '0x13881': {
        chainId: '0x13881',
        chainName: 'Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      },
      '0x61': {
        chainId: '0x61',
        chainName: 'BSC Testnet',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        blockExplorerUrls: ['https://testnet.bscscan.com']
      },
      '0x5': {
        chainId: '0x5',
        chainName: 'Goerli Testnet',
        nativeCurrency: {
          name: 'Goerli ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://rpc.goerli.mudit.blog'],
        blockExplorerUrls: ['https://goerli.etherscan.io']
      },
      '0xA869': {
        chainId: '0xA869',
        chainName: 'Avalanche Fuji Testnet',
        nativeCurrency: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18
        },
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://testnet.snowtrace.io']
      },
      '0x82752': {
        chainId: '0x82752',
        chainName: 'Scroll Sepolia Testnet',
        nativeCurrency: {
          name: 'Scroll',
          symbol: 'SCRL',
          decimals: 18
        },
        rpcUrls: ['https://sepolia.scroll.io'],
        blockExplorerUrls: ['https://scrollscan.io/sepolia']
      },
      '0x2803': {
        chainId: '0x2803',
        chainName: 'Arthera Mainnet',
        nativeCurrency: {
          name: 'Arthera',
          symbol: 'ART',
          decimals: 18
        },
        rpcUrls: ['https://rpc.mainnet.arthera.io'],
        blockExplorerUrls: ['https://explorer.arthera.io']
      },
      '0xAA36A7': {
        chainId: '0xAA36A7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: {
          name: 'Sepolia ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://rpc.sepolia.org'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      },
      '0x549': {
        chainId: '0x549',
        chainName: 'Berachain Testnet',
        nativeCurrency: {
          name: 'Bera',
          symbol: 'BERA',
          decimals: 18
        },
        rpcUrls: ['https://rpc.berachain-test.io'],
        blockExplorerUrls: ['https://explorer.berachain-test.io']
      },
      '0x2712': {
        chainId: '0x2712',
        chainName: 'Blast Testnet',
        nativeCurrency: {
          name: 'Blast',
          symbol: 'BLAST',
          decimals: 18
        },
        rpcUrls: ['https://testnet.blastapi.io'],
        blockExplorerUrls: ['https://explorer.testnet.blastapi.io']
      },
      '0x4268': {
        chainId: '0x4268',
        chainName: 'Holesky Testnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://holesky.etherscan.io'],
        blockExplorerUrls: ['https://explorer.holesky.etherscan.io']
      }
    };

    return networkParams[chainId] || null;
  }

  private setupNetworkListener() {
    fromEvent(this.ethereum, 'chainChanged')
      .pipe(
        filter((chainId: string) => !!chainId),
        map((chainId: string) => parseInt(chainId, 16))
      )
      .subscribe(() => {
        this.getNetworkInfo();
      });
  }

  public async getNetworkInfo() {
    if (this.web3) {
      const networkId = await this.web3.eth.net.getId();
      this._currentNetwork$.next('0x' + networkId.toString(16));
    }
  }
}
