import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SnackbarService } from './snackbar.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PromocodeService {
  private promoCodes = new BehaviorSubject([]);
  public promoCodeUpdated = new Subject();
  public discount = new BehaviorSubject({code: null, discount: null});
  public appliedPromo = new Subject();

  constructor(private _http: HttpClient, private snackbarService: SnackbarService, private configService: ConfigService) { 
    
    this.getAllPromoCodes().subscribe((codes: {promoCodes: []}) => {
      const { promoCodes } = codes
      if(!promoCodes){

      } else {
        this.promoCodes.next(promoCodes);
      }
    });

    const newPromoInput = this.promoCodeUpdated.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    newPromoInput.subscribe(code => {
      const promoCode = this.getPromoCode(code)
      if(promoCode){
        this.discount.next(promoCode);
        snackbarService.snackBarMessage.next(`DISCOUNT CODE: ${promoCode.code} -${promoCode.discount}% APPLIED`);
      } else {
        this.discount.next({code: null, discount: null})
      }
    });
  }

  getAllPromoCodes(){
    return this._http.get(`${this.configService.apiOrigin}/api/promocodes`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getPromoCode(searchCode){
    let code;
    this.promoCodes.getValue().forEach(promoCode => {
      if(promoCode.code === searchCode){
        code = promoCode;
      }
    });
    return code;
  }

}
