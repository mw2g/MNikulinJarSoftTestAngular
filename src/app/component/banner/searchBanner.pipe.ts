import {Pipe, PipeTransform} from '@angular/core';
import {Banner, Category} from '../../interfaces';

@Pipe({
    name: 'searchBanner'
})
export class SearchBannerPipe implements PipeTransform {
    transform(banners: Banner[], search = ''): Banner[] {
        if (!search.trim()) {
            return banners;
        }

        return banners.filter(banner => {
            return banner.name.toLowerCase().includes(search.toLowerCase());
        });
    }
}
