import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public subpath: string = '';
  public category: string = '';
  public classes: { [key: string]: string } = {
    'blog': 's-header_pb0 s-header_alt-bg-blog'
  };

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.subpath = event.url.split('/')[1].split('?')[0];
        this.category = event.url.split('/').pop().split('?')[0];console.log(this.category)
      }
    });
  }
}
