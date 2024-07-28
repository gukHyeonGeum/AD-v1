import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day'
})
export class DayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '평일';
				break;
				case 2:
					return '주말(공휴일)';
				break;
				case 3:
					return '평일&주말 모두';
				break;
			}
  	}
  }

}
