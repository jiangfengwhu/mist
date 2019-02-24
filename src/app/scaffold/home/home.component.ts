import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mist-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  ngOnInit() {
    const querys = document.querySelectorAll('.hvr-wobble-horizontal');
    querys.forEach((item: HTMLElement) => {
      item.style.color = this.getRandomColor();
    });
  }
}
