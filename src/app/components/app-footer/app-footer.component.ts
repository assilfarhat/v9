import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent implements OnInit {
  birthday: number = new Date().getFullYear();
  
  ngOnInit(): void {
  } 


}
