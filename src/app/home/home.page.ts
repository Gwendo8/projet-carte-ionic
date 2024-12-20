import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CardDetailsModalComponent } from '../card-details-modal/card-details-modal.component';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';
  userMenuOpen = false;
  profileImageUrl: string = '/assets/images/sasuke.jpeg';
  username = "Nom d'utilisateur";

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private router: Router,
    private navController: NavController
  ) {}

  navigateToUpdate(cardId: number) {
    this.router.navigate(['/update-card', cardId]);
  }

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }
    this.loadData();
    this.loadCategories(); // Charger les catégories ici
  }

  // Permet de recharger la page directement après l'ajout d'une carte
  ionViewWillEnter() {
    this.loadData();
  }

  logItem(item: any) {
    console.log('item', item);
  }

  loadData() {
    this.apiService.getData().subscribe(
      (response) => {
        this.data = response;
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

  // Méthode pour ouvrir le modale
  async openCardDetails(card: any, event: Event) {
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
  deleteCard(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      this.apiService.deleteCard(id).subscribe({
        next: (response) => {
          alert(response.message);
          this.data = this.data.filter((card) => card.id !== id);
          this.filteredData = this.filteredData.filter(
            (card) => card.id !== id
          );
          this.loadData();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression :', error);
          alert('Impossible de supprimer la carte.');
        },
      });
    }
  }

  // Ouvrir/fermer le menu utilisateur
  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  goToProfile() {
    this.navController.navigateForward('/profile');
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }

  async takeProfilePhoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
      });

      this.profileImageUrl =
        photo.webPath ?? photo.dataUrl ?? '/assets/images/default-profile.jpg';
    } catch (error) {
      console.error('Erreur lors de la prise de la photo', error);
    }
  }

  loadCategories() {
    this.apiService.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    );
  }
  filterByCategory() {
    if (this.selectedCategory === 'toutes') {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(
        (item) => item.category_name === this.selectedCategory
      );
    }
  }
}
