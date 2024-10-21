import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqComponent {
  index: number = 0;

  public faqs = [
    [
      {
        id: 'what-is-swapspace',
        title: 'What is SwapSpace?',
        content: `SwapSpace is an instant cryptocurrency exchange aggregator that allows exchanging over 3550 cryptocurrencies with fixed and floating rates without limits, registration, or additional fees.`
      },
      {
        id: 'how-does-swapspace-work',
        title: 'How does SwapSpace work?',
        content: `SwapSpace collects the rates from 30 (and counting) instant cryptocurrency swap services providing the opportunity to choose the most profitable option without going to all the exchanges’ websites and comparing their offers manually. It supports over 3550 cryptocurrencies for exchange, doesn’t take extra fees, and doesn't require any personal data from its customers.`
      },
      {
        id: 'do-i-need-to-register-to-use-swapspace',
        title: 'Do I need to register to use SwapSpace?',
        content: `No, you don’t have to create an account or provide any personal info to perform a swap.`
      },
      {
        id: 'why-should-i-trust-swapspace',
        title: 'Why should I trust SwapSpace?',
        content: `SwapSpace presents offers from many of the most trusted instant cryptocurrency swap services worldwide. As a non-custodial exchange, it doesn’t store your funds, which eliminates the custodial risks. Read more about how we work in section in <a href="https://swapspace.co/blog/why-swapspace">our blog</a>. To find out more about us, you can look at users’ <a href="https://www.trustpilot.com/review/swapspace.co">reviews on Trustpilot</a>. We also have a specialized section where you can read <a href="https://swapspace.co/reviews">customer reviews</a> for our partners.`
      },
      {
        id: 'what-is-swapspaces-fee',
        title: 'What is SwapSpace’s fee?',
        content: `SwapSpace charges no fee from its customers sharing the commissions with the exchange providers instead. That means you will never pay more than you would pay directly to the integrated services. The conversion rate you see includes all the exchange fees. Note: This fee does not include the miner fee (network commission).`
      },
      {
        id: 'how-can-i-buy-cryptocurrency-with-a-credit-card-on-swapspace',
        title: 'How can I buy cryptocurrency with a credit card on SwapSpace?',
        content: `You can buy cryptocurrency with fiat via a number of our specialized partners. Choose the fiat currency on the exchange widget on the main page and follow the instructions, or go to the <a href="https://swapspace.co/buy-crypto">“Buy crypto”</a> section to find out some info on a particular coin before buying. You can also read detailed instructions for buying crypto with debit or credit cards here: <a href="https://swapspace.co/blog/buy-crypto-with-fiat">Mercuryo</a>, <a href="https://swapspace.co/blog/buy-crypto-with-fiat-via-guardarian">Guardarian</a>.`
      }
    ],
    [
      {
        id: 'what-is-the-minimum-amount',
        title: 'What is the minimum amount?',
        content: `The minimal amount varies from coin to coin but usually starts from about 5 to 20 dollars for many coins. This is necessary to cover the network fees.`
      },
      {
        id: 'what-is-the-maximum-amount',
        title: 'What is the maximum amount?',
        content: `SwapSpace doesn’t have upper limits on the amount of coins to be exchanged. You can exchange as many coins as you want!`
      },
      {
        id: 'how-long-does-it-take-to-exchange-coins',
        title: 'How long does it take to exchange coins?',
        content: `Usually transactions take from 5 to 60 minutes depending on the blockchain capacity. Most of the exchanges are processed within a couple of minutes. If the transaction is large or the blockchain is overloaded, it may take a little longer depending on its size.`
      },
      {
        id: 'my-transaction-is-taking-too-long-what-should-i-do',
        title: 'My transaction is taking too long. What should I do?',
        content: `Sometimes the transaction time may be longer than usual. It may happen due to blockchain overload, DDoS attack on the exchange, or cryptocurrency updates. If you have any titles about your transaction, feel free to contact the support via online chat or <a href="mailto:support@swapspace.co">e-mail</a>.`
      },
      {
        id: 'will-i-have-to-go-through-kyc',
        title: 'Will I have to go through KYC?',
        content: `SwapSpace doesn’t have a mandatory pre-KYC procedure itself. That means you can exchange your coins without the need to register and provide your personal data. However, in case our partners’ risk management systems detect a red flag, they can require a selective KYC check.`
      },
      {
        id: 'why-is-the-amount-i-received-different-from-the-initial-amount',
        title: 'Why is the amount I received different from the initial amount?',
        content: `Due to cryptocurrency volatility, the exchange rate may fluctuate while our partners are processing the transaction. It can lead to either positive or negative changes in the final amount of cryptocurrency you receive in the wallet. Some exchanges offer fixed rates to avoid those changes.`
      },
      {
        id: 'what-is-a-floating-rate-exchange',
        title: 'What is a floating rate exchange?',
        content: `Due to cryptocurrency market volatility, the exchange rates may change during the exchange. Choosing the floating, or classic, exchange rate, you need to know that the rates may change at any moment, and you might receive more or fewer coins than you had been expecting.`
      },
      {
        id: 'what-is-a-fixed-rate-exchange',
        title: 'What is a fixed rate exchange?',
        content: `If you create a fixed rate exchange, the exchange service will freeze the rates for some time to help you to escape the rate fluctuations. You will have from 15 to 120 minutes to deposit your funds depending on the exchange service you chose. You will receive the estimated amount at the end.`
      },
      {
        id: 'what-is-the-difference-between-fixed-and-floating-exchange-rates',
        title: 'What is the difference between fixed and floating exchange rates?',
        content: `During the floating rate exchange, the exchange rate may vary in accordance with the market fluctuations, and the amount of coins you receive in the wallet may be a bit more or less than the expected one.<br><br> During the fixed rate exchange, the rates are fixed by the exchanger for some time so you could avoid the price shifts and receive the exact amount you expected. The rate may vary with the floating one because the risks are already included in the price.`
      },
      {
        id: 'how-do-i-cancel-my-transaction',
        title: 'How do I cancel my transaction?',
        content: `Blockchain transactions are irreversible. Once the funds are sent, you can’t cancel it anymore. Be careful and double-check all the payment details before sending cryptocurrency to us or anyone else.`
      },
      {
        id: 'what-is-the-transaction-hash',
        title: 'What is the transaction hash?',
        content: `Transaction hash is a unique set of characters that is given to every transaction in the blockchain. It allows you to check the transaction status.`
      },
      {
        id: 'what-is-a-wallet-address',
        title: 'What is a wallet address?',
        content: `A cryptocurrency wallet is a digital place to manage your coins or tokens. The wallet address implies a unique combination of numbers and letters, usually from 26 to 35 characters, that represents a possible destination of the payment. It may look like this: 0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7.<br><br> To create an exchange on SwapSpace, you need to provide a pre-existing wallet address. Read more about <a href="https://swapspace.co/blog/types-of-cryptocurrency-wallets-advantages-and-disadvantages">how to get a wallet</a> in our blog, or, if you want more details on a specific wallet, go to the “Wallets” section at <a href="https://swapspace.co/academy">SwapSpace Academy.</a>`
      }
    ],
    [
      {
        id: 'how-do-i-get-a-wallet-address',
        title: 'How do I get a wallet address?',
        content: `Choose the coin you want to buy or sell, then find a stable and proven service and register there to get a wallet. Usually, every coin has an official wallet client.`
      },
      {
        id: 'how-do-i-connect-my-wallet',
        title: 'How do I connect my wallet?',
        content: `If you're using Trezor you can connect it as a recipient wallet by pressing the 'Enter with Trezor' button above the 'Provide the recipient address' field. To connect and export your wallet address, you need to have Trezor Bridge installed.<br><br> You can also use MetaMask, Trezor, or WalletConnect to simplify transferring your funds. When prompted to send your crypto, you can press the 'Connect Wallet' button, choose your wallet option, authorize connecting it to SwapSpace, and approve the transaction.`
      },
      {
        id: 'what-is-the-recipient-address',
        title: 'What is the recipient address?',
        content: `The recipient address is an address that you provide to the exchange service as a destination address. It means the output transaction will go from the exchange service to this address. For example, if you want to buy Dogecoin (DOGE), you should specify a DOGE wallet address in the recipient field. Then swap service will send the coins to this address once the transaction is complete.`
      },
      {
        id: 'what-is-an-extra-id',
        title: 'What is an Extra ID?',
        content: `During the exchange process, you can see an optional field called 'Extra ID' when you're specifying your recipient or refund address (or both). Sometimes a piece of text and/or numbers called Extra ID is also given to you together with the deposit wallet address. Extra ID is meant for an additional information piece called a memo, destination tag, or message (the name depends on the cryptocurrency, but they all mean the same thing).<br><br> When you use a crypto exchange (typically a centralized one), sending or receiving some cryptocurrencies (for example, ALGO, BNB, EOS, and others) requires you to use this Extra ID. Memo/tag/message is required to correctly route the funds that you're sending and/or due to receive in exchange.<br><br> <ul><li>If you're sending the cryptocurrency that uses memo/tag/message technology, we will provide an Extra ID along with the wallet address you'll be transferring your funds to. Copy or scan this Extra ID and specify it in your wallet.</li><li>If you're due to receive one of the cryptocurrencies that use this technology, you will want a memo/tag/message in your wallet along with your address. Copy this information and specify it in the Extra ID field when you're filling in the destination address in any exchange.</li> <li>If you're providing the refund address for the crypto you're sending, find and fill in your memo/tag/message field, too, if it's applicable.</li></ul><br> Note that you are responsible for determining whether you need to use memo/tag/message in your transaction and filling this field if necessary, both in your wallet and in the exchange. If the Extra ID isn't specified, it can result in your funds being delayed or even lost—so be careful!<br><br> If you forget to put in your Extra ID, you should contact our support team to get your funds.`
      }
    ]
  ];

  change(i: number): void {
    this.index = i;
  }
}
