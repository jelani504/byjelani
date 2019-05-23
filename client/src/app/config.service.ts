import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public apiOrigin;
  constructor() { 
    if(environment.production){
      this.apiOrigin = window.location.origin;
    } else {
      this.apiOrigin = `http://localhost:8000`;
    }
  }
}
