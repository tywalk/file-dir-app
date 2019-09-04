import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileLoaderComponent } from './file-loader/file-loader.component'


const routes: Routes = [
  { path: 'upload', component: FileLoaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
