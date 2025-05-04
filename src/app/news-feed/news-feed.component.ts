import { Component } from '@angular/core';
import { NewsHeaderComponent } from './news-header/news-header.component';

@Component({
  selector: 'app-news-feed',
  imports: [NewsHeaderComponent],
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.css',
})
export class NewsFeedComponent {}
