import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smoking'
})
export class SmokingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '비흡연';
				break;
				case 2:
					return '가끔흡연';
				break;
				case 3:
					return '흡연';
				break;
			}
  	}
  }

}
