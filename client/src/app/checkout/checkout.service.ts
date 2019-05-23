import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  public countriesList;
  constructor(private _http: HttpClient, public configService: ConfigService) {
    this.getCountriesList().subscribe((res: {countries: []}) => {this.countriesList = res.countries; console.log(res.countries)});
   }

  getCountriesList(){
    return this._http.get(`${this.configService.apiOrigin}/api/countries`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
