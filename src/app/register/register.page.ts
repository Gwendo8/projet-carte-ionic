import { Component } from '@angular/core';
import { ApiService } from '../services/api.service'; 
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
  confirmPassword: string = ''; 

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private router : Router
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.showErrorToast('Les mots de passe ne correspondent pas');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.apiService.registerUser(userData).subscribe(
      async (response: any) => {
        // Afficher un message de succès
        const toast = await this.toastController.create({
          message: 'Compte créé avec succès !',
          duration: 2000,
          color: 'success',
        });
        toast.present();

        this.username = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.router.navigate(['/']);
      },
      async (error) => {
        this.showErrorToast('Erreur lors de la création du compte.');
      }
    );
  }
  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
}