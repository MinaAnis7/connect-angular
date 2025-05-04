import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast$ = new BehaviorSubject<{ message: string; isError: boolean } | null>(
    null
  );
}
