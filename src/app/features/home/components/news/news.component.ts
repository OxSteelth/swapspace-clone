import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent {
    protected index = 0;

    protected readonly itemsCount = 1;

    protected readonly items = [
        {
            title: 'SwapSpace celebrates 5th anniversary',
            subtitle: 'Join the SwapSpace birthday contest: showcase your creativity and win 100 USDT',
            img: 'https://storage.swapspace.co/static/2fdf70e32be177d527b5911f4c3f6e8edb90c28c62b8e33aace1bf4e9b90a977.png',
            dateTime: '5 Aug 2024 ◦ 3 min',
            link: '/news/swapspace-celebrates-anniversary'
        },
        {
            title: 'SwapSpace Huddle podcast launches',
            subtitle: 'Introducing SwapSpace Huddle: new web3 and crypto podcast launching September 3',
            img: 'https://storage.swapspace.co/static/34d9c58fe7d196052138b67c8cd8f84621b432165974f40a6e5c2986371e63f8.png',
            dateTime: '30 Aug 2024 ◦ 3 min',
            link: '/news/introducing-swapspace-huddle-new-web3-crypto-podcast'
        },
        {
            title: 'Anniversary contest: win with your creativity',
            subtitle: 'Join SwapSpace’s graphic challenge — keep the birthday party going and win!',
            img: 'https://storage.swapspace.co/static/cb3be504e4de6eda34385e9672e16d1fbdced16b8d8ccdabff447447305e14f8.png',
            dateTime: '12 Aug 2024 ◦ 2 min',
            link: '/news/anniversary-graphic-contest-win-with-your-creativity'
        }
    ];

    protected get rounded(): number {
        return Math.floor(this.index / this.itemsCount);
    }

    protected onIndex(index: number): void {
        this.index = index * this.itemsCount;
    }
}
