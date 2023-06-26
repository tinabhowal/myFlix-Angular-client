import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialogRef } from '@angular/material/dialog';
// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  
  /**
   * Sends the form inputs to the backend.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result: any) => {
        localStorage.setItem('username', result.user.Username);
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); // This will close the modal on success!
        this.router.navigate(['movies']);
        this.snackBar.open('Logged in', 'OK', {
          duration: 2000
        });
        this.updateLocalStorage(result.user);
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      }
    );
  }

  updateLocalStorage(user: any): void {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...storedUser, ...user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

}
