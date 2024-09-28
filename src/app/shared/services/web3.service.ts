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
        return 18;  // Ether (ETH) and BNB both have 18 decimals
      case 'solana':
        return 9;   // Solana (SOL) has 9 decimals
      case 'bitcoin':
        return 8;   // Bitcoin (BTC) has 8 decimals
      case 'polkadot':
        return 10;  // Polkadot (DOT) has 10 decimals
      case 'cardano':
      case 'ripple':
        return 6;   // Cardano (ADA) and Ripple (XRP) have 6 decimals
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
      gas: '21000',
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

        contract.methods.transfer(to, weiValue).estimateGas({ from: fromAddr }).then((gasAmount: number) => {
          return from(contract.methods.transfer(to, weiValue).send({ from: fromAddr, gas: gasAmount })).pipe(
            catchError(error => {
              console.error('Error sending transaction', error);
              throw error;
            })
          );
        }).catch(() => {
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
