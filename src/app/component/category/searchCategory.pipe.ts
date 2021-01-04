import {Pipe, PipeTransform} from '@angular/core';
import {Category} from '../../interfaces';

@Pipe({
    name: 'searchCategory'
})
export class SearchCategoryPipe implements PipeTransform {
    transform(categories: Category[], search = ''): Category[] {
        if (!search.trim()) {
            return categories;
        }

        return categories.filter(category => {
            return category.name.toLowerCase().includes(search.toLowerCase());
        });
    }
}
