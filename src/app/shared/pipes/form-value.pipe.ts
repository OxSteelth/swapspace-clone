import { AsyncPipe } from '@angular/common';
import { Pipe, type PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { startWith } from 'rxjs';

@Pipe({
  name: 'appFormValue',
})
export class FormValuePipe implements PipeTransform {
  constructor(public asyncPipe: AsyncPipe) {}

  transform(value: AbstractControl): unknown {
    return this.asyncPipe.transform(
      value.valueChanges.pipe(startWith(value.value))
    );
  }
}
