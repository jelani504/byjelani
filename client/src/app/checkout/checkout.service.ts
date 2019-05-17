import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  public countriesList;
  constructor(private _http: HttpClient) {
    this.getCountriesList().subscribe((res: {countries: []}) => {this.countriesList = res.countries; console.log(res.countries)});
   }

  getCountriesList(){
    return this._http.get('http://127.0.0.1:3000/api/countries', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
