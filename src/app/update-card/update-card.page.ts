import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.page.html',
  styleUrls: ['./update-card.page.scss'],
})
export class UpdateCardPage implements OnInit {
  card: any = { category: {}, series: {}, rarity: {} };
  isLoading: boolean = true;
  errorMessage: string | null = null;
  formData: any = {};
  selectedImage: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
    this.getCardDetails();
    this.getFormData();
  }

  // Récupère les détails de la carte en fonction de l'ID
  getCardDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getCardById(Number(id)).subscribe({
        next: (data) => {
          console.log('Données récupérées pour la carte :', data);
          this.card = {
            ...data,
            category: data.category || {},
            series: data.series || {},
            rarity: data.rarity || {},
          };
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération de la carte.';
          console.error(error);
          this.isLoading = false;
        },
      });
    } else {
      this.errorMessage = "L'ID de la carte est manquant.";
      this.isLoading = false;
    }
  }

  // Récupère les données des formulaires pour les listes déroulantes
  getFormData() {
    this.apiService.getListData().subscribe({
      next: (data) => {
        console.log('Données de formulaire récupérées :', data);
        this.formData = data;
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des données du formulaire',
          error
        );
      },
    });
  }

  // Fonction pour gérer le changement d'image
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file; 
    }
  }

  // Fonction pour mettre à jour la carte
  updateCard() {
    const formData = new FormData();
  
    formData.append('name', this.card.name);
    formData.append('description', this.card.description);
    formData.append('health_points', this.card.health_points.toString());
    formData.append('attack_points', this.card.attack_points.toString());
    formData.append('defense_points', this.card.defense_points.toString());
    formData.append('category_id', this.card.category.id);
    formData.append('rarity_id', this.card.rarity.id);
    formData.append('series_id', this.card.series.id);
  
    if (this.selectedImage) {
      formData.append('image', this.selectedImage); 
    }
  
    this.apiService.updateCard(this.card.id, formData).subscribe({
      next: () => {
        alert('Carte modifiée avec succès !');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Erreur lors de la modification de la carte', error);
        alert('Erreur lors de la modification de la carte.');
      },
    });
  }
  goBack() {
    this.router.navigate(['/home']);
  }
}
