import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'frequency'
})
export class FrequencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '월 1회 이하';
				break;
				case 2:
					return '월 1회';
				break;
				case 3:
					return '월 2~3회';
				break;
				case 4:
					return '월 4~5회';
				break;
				case 5:
					return '월 6회 이상';
				break;
			}
  	}
  }

}
