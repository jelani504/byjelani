import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public apiOrigin;
  public vmFacebookLink;
  public vmGoogleLink;
  constructor() { 
    if(environment.production){
      this.apiOrigin = window.location.origin;
    } else {
      this.apiOrigin = `https://localhost:8000`;
    }
    this.vmGoogleLink =  `${this.apiOrigin}/api/auth/login/google`;
    this.vmFacebookLink = `${this.apiOrigin}/api/auth/login/facebook`;
  }
}
