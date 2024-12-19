import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CardDetailsModalComponent } from '../card-details-modal/card-details-modal.component';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-accueil',
  templateUrl: './propos.page.html',
  styleUrls: ['./propos.page.scss'],
})
export class ProposPage implements OnInit {
  userMenuOpen = false;
  profileImageUrl: string = '/assets/images/sasuke.jpeg';
  username = "Nom d'utilisateur";

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private router: Router,
    private navController: NavController
  ) {}

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }
  }

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
}
