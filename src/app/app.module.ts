import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload'
import { TreeModule } from 'angular-tree-component';

@NgModule({
  declarations: [
    AppComponent,
    FileDropDirective,
    FileSelectDirective,
    FileLoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TreeModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
