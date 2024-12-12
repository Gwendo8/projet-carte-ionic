import { Component } from '@angular/core';
import { ApiService } from '../services/api.service'; // Assure-toi que le chemin est correct
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // Champ pour confirmer le mot de passe

  constructor(
    private apiService: ApiService, // Injection du service API
    private toastController: ToastController,
    private router : Router
  ) {}

  // Fonction appelée lors de la soumission du formulaire
  onSubmit() {
    // Vérifie si les mots de passe correspondent avant de soumettre
    if (this.password !== this.confirmPassword) {
      this.showErrorToast('Les mots de passe ne correspondent pas');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    // Envoi des données au backend via le service API
    this.apiService.registerUser(userData).subscribe(
      async (response: any) => {
        // Afficher un message de succès
        const toast = await this.toastController.create({
          message: 'Compte créé avec succès !',
          duration: 2000,
          color: 'success',
        });
        toast.present();

        // Réinitialiser les champs
        this.username = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.router.navigate(['/login']);
      },
      async (error) => {
        // Afficher un message d'erreur
        this.showErrorToast('Erreur lors de la création du compte.');
      }
    );
  }

  // Affiche un toast d'erreur
  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
}