import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {BannerService} from './banner.service';
import {Banner, Category} from '../../interfaces';
import {UtilsService} from '../../utils.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {CategoryService} from '../category/category.service';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './banner.component.html',
  providers: [DecimalPipe]
})
export class BannerComponent implements OnInit, OnDestroy {

  banners: Banner[];
  sort = true;
  searchStr = '';
  private listSub: Subscription;
  private updateSub: Subscription;
  private createSub: Subscription;
  categories: Observable<Array<Category>>;
  public currentBanner: Banner;
  public form: FormGroup;
  public alert = '';

  constructor(private bannerService: BannerService,
              private categoryService: CategoryService,
              private router: Router,
              private decimalPipe: DecimalPipe,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.categories = this.categoryService.getAll();
    this.listSub = this.bannerService.getAll().subscribe(banners => {
      this.banners = banners;
    }, error => {
      throwError(error);
    });
  }

  public selectCategory(banner: Banner): void {
    this.alert = '';
    this.currentBanner = banner;
    this.loadForm();
  }

  sortList(): void {
    const reverse = this.sort ? 1 : -1;
    this.banners.sort((a, b) => reverse * (a.name > b.name ? 1 : -1));
    this.sort = !this.sort;
  }

  loadForm(): void {
    this.form = new FormGroup({
      categoryId: new FormControl(this.currentBanner.bannerId, Validators.required),
      name: new FormControl(this.currentBanner.name, Validators.required),
      price: new FormControl(this.currentBanner.price === 0 ? '' :
        this.decimalPipe.transform(this.currentBanner.price, '0.2').replace(',', ''), Validators.required),
      content: new FormControl(this.currentBanner.content, Validators.required),
      category: new FormControl(this.currentBanner.category.name, Validators.required)
    });
  }

  initEmptyForm(): void {
    this.alert = '';
    this.currentBanner = null;
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
    });
  }

  update(): void {
    this.alert = '';
    this.updateSub = this.bannerService.update({
      ...this.currentBanner,
      name: this.form.value.name,
      price: this.form.value.price,
      content: this.form.value.content,
      category: {name: this.form.value.category}
    }).subscribe((data) => {
        if (!data.name) {
          this.alert = `Banner with name \'${this.form.value.name}\' is already exist`;
        } else {
          this.alert = '';
          this.currentBanner = data;
        }
      },
      error => {
        if (error instanceof HttpErrorResponse && error.status === 400) {
          for (const e of error.error.errors) {
            this.alert += ' ' + e.defaultMessage;
          }
        }
      }, () => {
        this.banners.map(banner => {
          if (banner.bannerId === this.currentBanner.bannerId) {
            banner.name = this.currentBanner.name;
            banner.price = this.currentBanner.price;
            banner.content = this.currentBanner.content;
            banner.category = this.currentBanner.category;
          }
        });
      });
  }

  create(): void {
    this.form.markAllAsTouched();
    this.alert = '';
    let category = null;
    if (this.form.value.category !== '') {
      category = {name: this.form.value.category};
    }
    this.createSub = this.bannerService.create({
      name: this.form.value.name,
      price: this.form.value.price,
      content: this.form.value.content,
      category
    }).subscribe((data) => {
      if (!data.name) {
        this.alert = `Banner with name \'${this.form.value.name}\' is already exist`;
      } else {
        this.alert = '';
        this.currentBanner = data;
        this.banners.push(this.currentBanner);
      }
    }, error => {
      if (error instanceof HttpErrorResponse && error.status === 400) {
        for (const e of error.error.errors) {
          this.alert += ' ' + e.defaultMessage;
        }
      }
    }, () => {
    });
  }

  delete(): void {
    this.createSub = this.bannerService.delete(this.currentBanner.bannerId).subscribe((data) => {
      this.banners = this.banners.filter(banner => banner.bannerId !== this.currentBanner.bannerId);
    }, () => {
      this.alert = 'Error to delete banner';
    }, () => {
      this.currentBanner = null;
      this.form = null;
    });
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.listSub,
      this.createSub,
      this.updateSub
    ]);
  }
}
