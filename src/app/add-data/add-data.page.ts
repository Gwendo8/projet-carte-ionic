import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.page.html',
  styleUrls: ['./add-data.page.scss'],
})
export class AddDataPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  showSearchBar = false;


  // Méthode pour basculer la barre de recherche
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar; // Change l'état
  }
}
