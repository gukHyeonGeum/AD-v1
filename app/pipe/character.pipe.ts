import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'character'
})
export class CharacterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		value = parseInt(value);
  		switch(value){
				case 1:
					return '유머있는';
				break;
				case 2:
					return '낙천적인';
				break;
				case 3:
					return '지적인';
				break;
				case 4:
					return '박력있는';
				break;
				case 5:
					return '상냥한';
				break;
				case 6:
					return '귀여운';
				break;
				case 7:
					return '감성적인';
				break;
				case 8:
					return '차분한';
				break;
				case 9:
					return '다소곳한';
				break;
				case 10:
					return '외향적인';
				break;
				case 11:
					return '내향적인';
				break;
				case 22:
					return '기타';
				break;
			}
  	}
  }

}
