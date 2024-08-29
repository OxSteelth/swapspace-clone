import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDateDiff',
})
export class DateDiffPipe implements PipeTransform {
  dateFormater = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  transform(date: number): unknown {
    const minuteDifference = Math.floor((new Date().getTime() - date) / 60000);

    if (minuteDifference < 1) {
      return 'Just now';
    }

    if (minuteDifference < 60) {
      return `${minuteDifference}m ago`;
    }

    const hourDifference = Math.floor(minuteDifference / 60);

    if (hourDifference < 24) {
      return `${hourDifference}h ago`;
    }

    return this.dateFormater.format(date);
  }
}
