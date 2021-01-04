import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {CategoryService} from './category.service';
import {Category} from '../../interfaces';
import {UtilsService} from '../../utils.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit, OnDestroy {

  categories: Category[];
  sort = true;
  searchStr = '';
  private listSub: Subscription;
  private updateSub: Subscription;
  private createSub: Subscription;
  public currentCategory: Category;
  public form: FormGroup;
  public alert = '';

  constructor(private categoryService: CategoryService,
              private router: Router,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.listSub = this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    }, error => {
      throwError(error);
    });
  }

  public selectCategory(category: Category): void {
    this.alert = '';
    this.currentCategory = category;
    this.loadForm();
  }

  sortList(): void {
    const reverse = this.sort ? 1 : -1;
    this.categories.sort((a, b) => reverse * (a.name > b.name ? 1 : -1));
    this.sort = !this.sort;
  }

  loadForm(): void {
    this.form = new FormGroup({
      categoryId: new FormControl(this.currentCategory.categoryId, Validators.required),
      name: new FormControl(this.currentCategory.name, Validators.required),
      reqName: new FormControl(this.currentCategory.reqName, Validators.required),
    });
  }

  initEmptyForm(): void {
    this.alert = '';
    this.currentCategory = null;
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      reqName: new FormControl('', Validators.required),
    });
  }

  update(): void {
    this.alert = '';
    this.updateSub = this.categoryService.update({
      ...this.currentCategory,
      name: this.form.value.name,
      reqName: this.form.value.reqName
    }).subscribe((data) => {
        if (!data.name) {
          this.alert = `Category with name \'${this.form.value.name}\' is already exist`;
        } else if (!data.reqName) {
          this.alert = `Category with request name \'${this.form.value.reqName}\' is already exist`;
        } else {
          this.alert = '';
          this.currentCategory = data;
        }
      },
      error => {
        if (error instanceof HttpErrorResponse && error.status === 400) {
          for (const e of error.error.errors) {
            this.alert += ' ' + e.defaultMessage;
          }
        }
      }, () => {
        this.categories.map(category => {
          if (category.categoryId === this.currentCategory.categoryId) {
            category.name = this.currentCategory.name;
            category.reqName = this.currentCategory.reqName;
          }
        });
      });
  }

  create(): void {
    this.form.markAllAsTouched();
    this.alert = '';
    this.createSub = this.categoryService.create({
      name: this.form.value.name,
      reqName: this.form.value.reqName
    }).subscribe((data) => {
      if (!data.name) {
        this.alert = `Category with name \'${this.form.value.name}\' is already exist`;
      } else if (!data.reqName) {
        this.alert = `Category with request name \'${this.form.value.reqName}\' is already exist`;
      } else {
        this.alert = '';
        this.currentCategory = data;
        this.categories.push(this.currentCategory);
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
    this.createSub = this.categoryService.delete(this.currentCategory.categoryId).subscribe((data) => {
      this.alert = data.message;
    }, () => {
      this.alert += 'Error to delete category';
    }, () => {
      if (this.alert) {
        this.alert = `Category ${ this.currentCategory.name } cannot be deleted, following banners use it: ${ this.alert }`;
      } else {
        this.categories = this.categories.filter(category => category.categoryId !== this.currentCategory.categoryId);
        this.currentCategory = null;
        this.form = null;
      }
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
