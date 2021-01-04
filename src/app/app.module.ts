import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MainLayoutComponent} from './component/main-layout/main-layout.component';
import {RouterModule} from '@angular/router';
import {SearchCategoryPipe} from './component/category/searchCategory.pipe';
import {CategoryComponent} from './component/category/category.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BannerComponent} from './component/banner/banner.component';
import {SearchBannerPipe} from './component/banner/searchBanner.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    SearchCategoryPipe,
    SearchBannerPipe,
    CategoryComponent,
    BannerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: '', component: MainLayoutComponent, children: [
            { path: '', redirectTo: '/banners', pathMatch: 'full' },
            {path: 'categories', component: CategoryComponent},
            {path: 'banners', component: BannerComponent}
          ]
        }
      ]
    ),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
