import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CardDetailsModalComponent } from '../card-details-modal/card-details-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  data: any[] = []; // Contiendra les données récupérées
  showSearchBar = false;

  constructor(private apiService: ApiService, private modalController: ModalController) {}

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

  // Méthode pour basculer la barre de recherche
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar; // Change l'état
  }

  // Méthode pour ouvrir la modale
  async openCardDetails(card: any) {
    const modal = await this.modalController.create({
      component: CardDetailsModalComponent,
      componentProps: {
        card: card, 
      },
    });
    await modal.present();
  }
}