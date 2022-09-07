import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {

  transform(user: any): string {
    const fName = user.firstName ? user.firstName : '';
    const lName = user.lastName ? user.lastName : '';
    return fName + ' ' + lName;
  }

}
