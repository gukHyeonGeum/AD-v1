import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blood'
})
export class BloodPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return 'O형';
				break;
				case 2:
					return 'A형';
				break;
				case 3:
					return 'B형';
				break;
				case 4:
					return 'AB형';
				break;
				case 5:
					return '기타';
				break;
			}
  	}
  }

}
