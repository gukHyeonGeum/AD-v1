import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(input: any, args?: any): any {
  	if (!input) {
    	return;
    } else {
				var birth = input.split("-");
				var today = new Date();
				var year	= today.getFullYear()-1; 
				var month	= today.getMonth()+1;
				var day		= today.getDate();
				var ck		= parseInt(birth[0]);

				if(ck == 0) return "";

				var age = year - ck;
				var tmd = parseInt(month+''+day);
				var bmd = parseInt(birth[1]+''+birth[2]);

				if (tmd >= bmd) {
					age++;
				}

				return age;
    }
  }

}
