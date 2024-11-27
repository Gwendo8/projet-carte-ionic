import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  data: any[] = []; // Contiendra les données récupérées

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getData().subscribe(
      (response) => {
        this.data = response; // Stocker les données récupérées
        console.log(this.data); // Afficher les données dans la console
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
    );
  }
  showSearchBar = false;


  // Méthode pour basculer la barre de recherche
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar; // Change l'état
  }
}