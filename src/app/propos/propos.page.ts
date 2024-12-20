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
  userId = 'id';

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private router: Router,
    private navController: NavController
  ) {}

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    const storedUserid = localStorage.getItem('userId');
    if (storedUsername) {
      this.username = storedUsername;
    }
    if (storedUserid) {
      this.userId = storedUserid;
      this.loadProfileImage(this.userId);
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
        resultType: CameraResultType.Uri,
      });

      const file = await fetch(photo.webPath!)
        .then((res) => res.blob())
        .then(
          (blob) => new File([blob], 'profile.jpg', { type: 'image/jpeg' })
        );

      this.saveProfileImage(file);
    } catch (error) {
      console.error('Erreur lors de la prise de la photo', error);
    }
  }
  saveProfileImage(file: File) {
    const formData = new FormData();
    formData.append('profile_image', file);
    formData.append('userId', this.userId);

    this.apiService.updateProfileImage(formData).subscribe({
      next: (response) => {
        console.log('Image sauvegardée avec succès', response);
      },
      error: (error) => {
        console.error("Erreur lors de la sauvegarde de l'image", error);
      },
    });
  }

  loadProfileImage(userId: string) {
    this.apiService.getProfileImage(userId).subscribe({
      next: (response) => {
        console.log('rep', response);
        if (response.image_url) {
          this.profileImageUrl = response.image_url;
          console.log('img', this.profileImageUrl);
        } else {
          this.profileImageUrl = '/assets/images/sasuke.jpeg';
        }
      },
      error: (error) => {
        console.error("Erreur lors du chargement de l'image", error);
        this.profileImageUrl = '/assets/images/sasuke.jpeg';
      },
    });
  }
}
