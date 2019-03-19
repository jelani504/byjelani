import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
} from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';

const modules = [
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatCheckboxModule
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class AppMaterialModule { }
