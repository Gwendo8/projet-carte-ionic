import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage implements OnInit {
  categories: any[] = [];
  series: any[] = [];
  rarities: any[] = [];

  card = {
    name: '',
    image_url: '',
    description: '',
    health_points: 0,
    attack_points: 0,
    defense_points: 0,
    category_id: null,
    rarity_id: null,
    series_id: null,
  };

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getListData().subscribe(
      (response) => {
        this.categories = response.categories; 
        this.series = response.series; 
        this.rarities = response.rarities; 
        console.log('Categories:', this.categories);
        console.log('Series:', this.series);
        console.log('Rarities:', this.rarities);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
    );
  }

  // Fonction pour ajouter la carte
  addCard() {
    this.apiService.addCard(this.card).subscribe(
      (response) => {
        console.log('Carte ajoutée:', response);
        alert('Carte ajoutée avec succès!');
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la carte:', error);
        alert('Erreur lors de l\'ajout de la carte.');
      }
    );
  }
}