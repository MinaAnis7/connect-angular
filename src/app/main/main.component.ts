import { Component } from '@angular/core';
import { MainHeaderComponent } from './main-header/main-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MainHeaderComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
