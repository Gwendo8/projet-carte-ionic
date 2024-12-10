import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Pour récupérer l'ID depuis l'URL
import { ApiService } from '../services/api.service'; // Import du service

@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.page.html',
  styleUrls: ['./update-card.page.scss'],
})
export class UpdateCardPage implements OnInit {
  card: any = null; // Contient les données de la carte
  isLoading: boolean = true; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getCardDetails();
  }

  getCardDetails() {
    const id = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID depuis l'URL
    if (id) {
      this.apiService.getCardById(Number(id)).subscribe({
        next: (data) => {
          this.card = data;
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
}