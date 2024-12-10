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
  data: any[] = []; // Toutes les données récupérées
  filteredData: any[] = []; // Données filtrées affichées
  searchTerm: string = '';

  constructor(
    private apiService: ApiService,
    private modalController: ModalController
  ) {}


  ngOnInit() {
    this.loadData();
  }

  // Permet de recharger la page home directement après l'ajout d'une carte
  ionViewWillEnter() {
    this.loadData();
  }

  logItem(item: any) {
    console.log("item",item);
  }

  loadData() {
    this.apiService.getData().subscribe(
      (response) => {
        this.data = response; // Stocker les données récupérées
        this.filteredData = this.data;
        console.log(this.data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
    );
  }

  // Méthode pour filtrer les cartes
  filterCards(event: any) {
    const searchValue = this.searchTerm.toLowerCase();
    if (!searchValue) {
      this.filteredData = this.data;
      return;
    }
    this.filteredData = this.data.filter((item) =>
      item.card_name.toLowerCase().startsWith(searchValue)
    );
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
