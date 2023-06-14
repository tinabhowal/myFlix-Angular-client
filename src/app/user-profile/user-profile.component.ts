

import { Component, OnInit, Input } from '@angular/core';

// // You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// // This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

import { formatDate } from '@angular/common';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  user: any = {};
  favouriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };
  

  constructor(
    public fetchApiData: FetchApiDataService,
    //public dialogRef: MatDialogRef<UserProfileComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
    
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Gets the user info and favorite movies from the API.
   */
  getUser(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.
      getOneUser(username).subscribe(
        (user) => {
          this.user = user;
          this.userData.Username = user.Username;
          this.userData.Email = user.Email;
          // this.userData.Birthday = user.Birthday;
          this.userData.Birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');


          this.fetchApiData.getAllMovies().subscribe((resp: any) => {
            this.favouriteMovies = resp.filter((m: { _id: any; }) => this.user.FavouriteMovies.indexOf(m._id) >= 0);
          });
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Failed to get user details', 'OK', {
            duration: 2000
          });
        }
      );
    } else {
      console.error('Username not found in local storage');
    }
  }
  

  
  
  
  
  

 

  /**
   *Calls the API to update the user info.
   */   
  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));

      this.snackBar.open('User successfully updated', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  
  /**
  *Calls the API to delete the user.
  */
  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe((result) => {
      localStorage.clear();
      this.router.navigate(['welcome']);
      this.snackBar.open('User successfully deleted', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }
}
