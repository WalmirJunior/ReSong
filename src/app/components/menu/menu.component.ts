import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Importando o Router

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) {}  // Injetando o Router

  ngOnInit() {}

  // Método para navegação
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
