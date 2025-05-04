import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ToastComponent } from './toast/toast.component';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  host: {
    class: 'toast-container position-fixid top-0 end-0 m-2',
  },
})
export class ToastContainerComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscribtion = this.toastService.toast$.subscribe({
      next: (toastObj) => {
        if (toastObj) this.showToast(toastObj.isError, toastObj.message);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscribtion.unsubscribe();
    });
  }

  showToast(isError: boolean, message: string) {
    const toast = this.container.createComponent(ToastComponent);
    toast.instance.isError = isError;
    toast.instance.message = message;

    setTimeout(() => toast.destroy(), 5500);
  }
}
