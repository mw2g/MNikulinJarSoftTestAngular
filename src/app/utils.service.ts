import {Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UtilsService {

  public unsubscribe(subscribes: Array<Subscription>): void {
    for (const subscribe of subscribes) {
      if (subscribe) {
        subscribe.unsubscribe();
      }
    }
  }
}
