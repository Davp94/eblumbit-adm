import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuariosResponse } from '../../../../core/models/usuarios/UsuariosResponse';

@Component({
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  selector: 'app-usuarios-form',
  styleUrl: './usuarios-form.css',
  templateUrl: './usuarios-form.html',
})
export class UsuariosForm implements OnInit {
  
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsuariosForm>);
  userForm!: FormGroup;
  isEditMode = false;
  data: UsuariosResponse = inject(MAT_DIALOG_DATA); 

  availableRoles = [
    { id: 1, name: 'Administrador'},
    { id: 2, name: 'Ventas'},
    { id: 3, name: 'Rrhh'}
  ];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.isEditMode = !!this.data;
    this.userForm = this.fb.group({
      nombres: [this.data?.nombres || '', [Validators.required]],
      apellidos: [this.data?.apellidos || [Validators.required]],
      username: [this.data?.username || [Validators.required]],
      email: [this.data?.email || [Validators.required, Validators.email]],
      rolIds: [this.data?.rolIds || [Validators.required]]
    });
  }

  onSubmit(): void {
    if(this.userForm.valid) {
      const formValue = this.userForm.value;
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
