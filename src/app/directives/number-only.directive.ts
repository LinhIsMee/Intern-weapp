import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {

  @Output() valueChange = new EventEmitter<string>();

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: InputEvent): void {
    let initalValue: string = this.el.nativeElement.value;
    initalValue = initalValue.replace(/[^0-9]/g, '');

    this.el.nativeElement.value = initalValue;
    this.valueChange.emit(initalValue);

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
