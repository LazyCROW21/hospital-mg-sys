import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchField(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const formGroup = control as FormGroup;
        const ctrl1: string = formGroup.get(field1)?.value;
        const ctrl2: string = formGroup.get(field2)?.value;
        if (ctrl1 === ctrl2) {
            return null;
        }
        return { misMatch: true, field1, field2 };
    }
}