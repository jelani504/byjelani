import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  icons = { header: ['myaccount', 'cart', 'menu']};

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  registerIcons(){
    Object.values(this.icons).forEach(component => component.forEach(icon => 
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`))
      )
    );
  }
}
