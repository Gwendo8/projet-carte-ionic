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

  // Récupérer les détails de la carte en fonction de l'ID
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

  // Récupérer les données de formulaire pour les listes déroulantes
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Fonction pour mettre à jour la carte
  updateCard() {
    if (this.selectedImage) {
      this.card.image_url = this.selectedImage;
    }

    const updatedCard = {
      ...this.card,
      category_id: this.card.category.id,
      series_id: this.card.series.id,
      rarity_id: this.card.rarity.id,
    };

    this.apiService.updateCard(updatedCard).subscribe({
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
}
