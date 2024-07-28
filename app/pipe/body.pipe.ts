import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'body'
})
export class BodyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '보통 체형이에요';
				break;
				case 2:
					return '날씬한 편이에요';
				break;
				case 3:
					return '통통한 편이에요';
				break;
				case 4:
					return '탄탄한 체형이에요';
				break;
				case 5:
					return '조금 마른편이에요';
				break;
				case 6:
					return '조금 뚱뚱한편이에요';
				break;
				case 7:
					return '근육질(운동선수형) 체형이에요';
				break;
				case 8:
					return '기타';
				break;
			}
  	}
  }

}
