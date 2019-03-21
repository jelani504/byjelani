import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatRadioModule,
} from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from './icon.service';

const modules = [
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatCheckboxModule,
  MatRadioModule
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class AppMaterialModule { 
  constructor( private iconService: IconService){
    iconService.registerIcons();
  }
}
