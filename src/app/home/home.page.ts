import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CardDetailsModalComponent } from '../card-details-modal/card-details-modal.component';
import { Router } from '@angular/router';


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
    private modalController: ModalController,
    private router: Router
  ) {}

  navigateToUpdate(cardId: number) {
  this.router.navigate(['/update-card', cardId]);
}

  ngOnInit() {
    this.loadData();
  }

  // Permet de recharger la page home directement après l'ajout d'une carte
  ionViewWillEnter() {
    this.loadData();
  }

  logItem(item: any) {
    console.log('item', item);
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
  async openCardDetails(card: any,event: Event) {
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: CardDetailsModalComponent,
      componentProps: {
        card: card,
      },
    });
    await modal.present();
  }

  // Méthode pour supprimer une carte
  deleteCard(id: number, event:Event) {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      this.apiService.deleteCard(id).subscribe({
        next: (response) => {
          alert(response.message); 
          this.data = this.data.filter((card) => card.id !== id); 
          this.filteredData = this.filteredData.filter((card) => card.id !== id); 
          this.loadData();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression :', error);
          alert('Impossible de supprimer la carte.');
        },
      });
    }
  }
}