import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'height'
})
export class HeightPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		if (value == 155) {
  			return value + 'cm 이하';
  		} else if (value == 190) {
  			return value + 'cm 이상';
  		} else {
  			return value + 'cm';
  		} 		
  	}
  }

}
