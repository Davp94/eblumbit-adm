import { JsonPipe } from '@angular/common';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  imports: [MatCardModule, MatButtonModule, MatDividerModule,
    MatFormFieldModule, MatIconModule, MatInputModule,
    MatSnackBarModule, ReactiveFormsModule, JsonPipe
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly hidePassword = signal(true);
  
  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    console.log('SUBIT FORM')
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.authService.login(this.form.get('username')!.value, this.form.get('password')!.value).subscribe({
      next: () => {
        this.snackBar.open("Sesion iniciada correctamente", 'Cerrar', {duration: 3000})
      },
      error: (err)=> {
        this.snackBar.open("Error al iniciar Sesion", 'Cerrar', {duration: 3000})
      }
    })
    
  }


}
