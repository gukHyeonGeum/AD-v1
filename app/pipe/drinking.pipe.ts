import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'drinking'
})
export class DrinkingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '마시지 않아요';
				break;
				case 2:
					return '어쩔수 없을때만 마셔요';
				break;
				case 3:
					return '가끔이지만 약해요';
				break;
				case 4:
					return '평균주량이에요';
				break;
				case 5:
					return '어느정도 즐기는 편이에요';
				break;
				case 6:
					return '많이 즐기는 편이에요';
				break;
			}
  	}
  }

}
