import { FormControl } from '@angular/forms';

export function updateDisabledControlValue(
  control: FormControl,
  value: any
): void {
  if (control.disabled) {
    control.enable();
    control.setValue(value, { emitEvent: false });
    control.disable();
  }
}
