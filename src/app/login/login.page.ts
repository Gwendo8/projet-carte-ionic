import { Component } from '@angular/core';
import { ApiService } from '../services/api.service'; // Vérifie que le chemin est correct
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private router : Router
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.showToast('Veuillez remplir tous les champs.');
      return;
    }

    this.apiService.login(this.email, this.password).subscribe({
      next: async (response) => {
        // Connexion réussie
        await this.showToast('Connexion réussie.');
        this.router.navigate(['/home']);
      },
      error: async (error) => {
        // Gestion des erreurs
        const message =
          error.status === 401
            ? 'Identifiants incorrects.'
            : 'Erreur de connexion.';
        await this.showToast(message);
        console.error(error);
      },
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}