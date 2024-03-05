
import {filter} from 'rxjs/operators';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-breadcrumbs',
  template:  `
  
  <button  (click)="navToPrivious()" *ngIf="previousUrl!=currentUrl && previousUrl" class="btn btn-secondary btn-sm" 
  title="back">
  <i   class="fa fa-backward" aria-hidden="true"></i>  Page précédente</button>
  <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last>

    <li class="breadcrumb-item"
        *ngIf="breadcrumb.label.title&&breadcrumb.url.substring(breadcrumb.url.length-1) == '/'||breadcrumb.label.title&&last"
        [ngClass]="{active: last}">
      <a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>
      <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
    </li>
  </ng-template>`
})
export class AppBreadcrumbsComponent {
  breadcrumbs: Array<Object>;
  previousUrl: string = null;
  currentUrl: string = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
  
      let finUrl = event.url.indexOf("?")
  
     if(finUrl!=-1){
       if(this.currentUrl!=null){
      if(!(event.url.substring(finUrl,event.url.length)== this.currentUrl.substring(finUrl,this.currentUrl.length))){
        this.currentUrl = event.url;

      }else{
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    }
      else{
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }

     }else{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
     }
      
    //  if(!(event.url.substring(finUrl,event.url.length)== this.currentUrl.substring(finUrl,this.currentUrl.length))){
    //  this.previousUrl = this.currentUrl;
    //  }
    //  else {
    //  this.previousUrl = this.currentUrl;
    //  this.currentUrl = event.url;
   //  }
    
    
   // }
    
  });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      this.breadcrumbs = [];
      let currentRoute = this.route.root,
      url = '';
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        // tslint:disable-next-line:no-shadowed-variable
        childrenRoutes.forEach(route => {
          if (route.outlet === 'primary') {
            const routeSnapshot = route.snapshot;
            url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
            this.breadcrumbs.push({

              label: route.snapshot.data,
              url:   url
            });
            currentRoute = route;
       
          }
        });
      } while (currentRoute);
    });
  }
  navToPrivious(){

// if(this.previousUrl.indexOf('?')!=-1)
// this.previousUrl=this.previousUrl.substring(0,this.previousUrl.indexOf('?'))

    this.router.navigateByUrl(this.previousUrl);

  }





}
