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
    category_id: '',
    rarity_id: '',
    series_id: '',
  };

  constructor(private apiService: ApiService) { }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    console.log('Fichier sélectionné:', event.target.files[0]);
    this.selectedFile = event.target.files[0];
  }

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
    const formData = new FormData();
    formData.append('name', this.card.name);
    formData.append('description', this.card.description);
    formData.append('health_points', this.card.health_points.toString());
    formData.append('attack_points', this.card.attack_points.toString());
    formData.append('defense_points', this.card.defense_points.toString());
    formData.append('category_id', this.card.category_id);
    formData.append('rarity_id', this.card.rarity_id);
    formData.append('series_id', this.card.series_id);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    this.apiService.addCard(formData).subscribe(
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