import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weight'
})
export class WeightPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		if (value == 45) {
  			return value + 'kg 이하';
  		} else if (value == 90) {
  			return value + 'kg 이상';
  		} else {
  			return value + 'kg';
  		} 		
  	}
  }

}
