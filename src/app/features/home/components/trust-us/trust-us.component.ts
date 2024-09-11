import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-trust-us',
    templateUrl: './trust-us.component.html',
    styleUrls: ['./trust-us.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrustUsComponent {
    protected index = 0;

    protected readonly itemsCount = 1;

    protected readonly items = [
        {
            author: 'Erkki Papunen',
            icon: '',
            mock: 'Er',
            link: 'https://www.trustpilot.com/reviews/66d5bed2d9cdf8a383933049',
            text: `I've been using this crypto exchange for a while now, and I must say, it stands out as one of the most reasonable and user-friendly
                platforms in the market. The interface is clean and intuitive, making it easy for both beginners and experienced traders to
                navigate. The fees are incredibly competitive, and I've noticed that they consistently offer better rates than many other exchanges
                I've tried.`
        },
        {
            author: 'Ramy',
            icon: '',
            mock: 'Ra',
            link: 'https://www.trustpilot.com/reviews/66d490014a817f36263f3999',
            text: `Fast and easy with a lots of networks to choose from.`
        },
        {
            author: 'Lucas Preziosi',
            icon: 'https://storage.swapspace.co/static/66d479bf2619883e99ed57ee-trustpilot-review.png',
            mock: '',
            link: 'https://www.trustpilot.com/reviews/66d479bf2619883e99ed57ee',
            text: `very fast .........`
        },
        {
            author: 'Keith Jackson',
            icon: 'https://storage.swapspace.co/static/66d34ccc989ab21f36464272-trustpilot-review.png',
            mock: '',
            link: 'https://www.trustpilot.com/reviews/66d34ccc989ab21f36464272',
            text: `super fast and trusted A+`
        },
        {
            author: 'Tim Kocher',
            icon: '',
            mock: 'Ti',
            link: 'https://www.trustpilot.com/reviews/66d0308d4ffad1458cd12b0b',
            text: `I was really scared to use this service since I have been scammed numerous times. But a friend of mine had ADA on the beacon chain
                for whatever reason and could not swap it via his wallet or exchange. So SwapSpace was kind of our last resort. It was super easy to
                create the exchange offer, took ~5 minutes (less than announced) and we even received more ADA (Cardano) than expected. I am really
                grateful.`
        }
    ];

    protected get rounded(): number {
        return Math.floor(this.index / this.itemsCount);
    }

    protected onIndex(index: number): void {
        this.index = index * this.itemsCount;
    }
}
