import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'career'
})
export class CareerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '1년 이하';
				break;
				case 2:
					return '1~3년';
				break;
				case 3:
					return '4~6년';
				break;
				case 4:
					return '7~10년';
				break;
				case 5:
					return '10년 이상';
				break;
				case 6:
					return '20년 이상';
				break;
				case 7:
					return '30년 이상';
				break;
			}
  	}
  }

}
