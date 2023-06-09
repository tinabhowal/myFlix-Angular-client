// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = []; //a variable named movies is declared as an array. This is where the movies returned from the API call will be kept
  constructor(public fetchApiData: FetchApiDataService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog ) { }

ngOnInit(): void {
  this.getMovies();
}

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }


  //opens the genre dialog
  openGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description
      },
      //width: '280px'
    });
  }

  //opens director dialog
  openDirector(name: string, bio: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: bio
      },
      //width: '280px'
    });
  }

  //opens the movie description
  openSynopsis(description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: 'Synopsis',
        content: description
      },
      //width: '280px'
    });
  }

  /**
   * Calls the add favorite movie method on the API.
   * @param id The movie ID
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {

      this.snackBar.open('Movie added to favorites.', 'OK', {
        duration: 2000
      });
    });
  }

  /**
  * Calls the check favorite movie method on the API.
  * @param id The movie ID
  */
  isFavorite(id: string): boolean {
    //return this.fetchApiData.isFavoriteMovie(id);
    // Call the API method to check if the movie is marked as a favorite
  const isFavorite = this.fetchApiData.isFavoriteMovie(id);

  // Return the result as a boolean value
  return isFavorite;
  }

  /**
   * Calls the delete favorite movie method on the API.
   * @param id The movie ID
   */
  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites.', 'OK', {
        duration: 2000
      });
    });
  }
}
