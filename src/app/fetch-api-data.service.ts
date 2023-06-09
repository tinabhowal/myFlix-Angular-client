import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';



//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflix-gqp8.onrender.com/';

@Injectable({
  providedIn: 'root'
})

/**
 *Creates a new service to load the data from the API.
 */
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  /**
  *  Makes the API call for the user registration endpoint.
  * @param userDetails The user credentials
  * @returns http POST request
  */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Makes the api call for the user login endpoint.
  * @param userDetails The user credentials
  * @returns http POST request
  */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
  * Makes the api call for the get all movies endpoint.
  * @returns http GET request
  */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
  * Makes the api call for the get one movie endpoint.
  * @param title The movie title
  * @returns http GET request
  */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
  * Making the api call for the get one director endpoint.
  * @param directorName The director name
  * @returns http GET request
  */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
  * Makes the api call for the get one genre endpoint.
  * @param genreName The genre name
  * @returns http GET request
  */
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
  * Makes the api call for the get one user endpoint.
  * @returns http GET request
  */


  // getOneUser(): Observable<any> {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   return user;

  //  }


 


  getOneUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  
  
  // addFavoriteMovie(movieId: string): Observable<any> {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   const token = localStorage.getItem('token');
  //   if (!user.FavouriteMovies) {
  //     user.FavouriteMovies = []; // Initialize the array if it doesn't exist
  //   }
  //   user.FavouriteMovies.push(movieId);
  
  //   return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + token,
  //     }),
  //     responseType: "text"
  //   }).pipe(
  //     switchMap(() => {
  //       // If the POST request is successful, update the user details on the server
  //       return this.editUser(user);
  //     }),
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }
  
  // deleteFavoriteMovie(movieId: string): Observable<any> {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   const token = localStorage.getItem('token');
  
  //   const index = user.FavouriteMovies.indexOf(movieId);
  //   if (index > -1) { // only splice array when item is found
  //     user.FavouriteMovies.splice(index, 1); // 2nd parameter means remove one item only
  //   }
  
  //   return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + token,
  //     }),
  //     responseType: "text"
  //   }).pipe(
  //     switchMap(() => {
  //       // If the DELETE request is successful, update the user details on the server
  //       return this.editUser(user);
  //     }),
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }



 
  







  /**
  * Makes the api call for the get favourite movies for an user endpoint.
  * @returns http GET request
  */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavouriteMovies),
      catchError(this.handleError)
    );
  }

  /**
  * Making the api call for the add a movie to favorite movies endpoint.
  * @param movieId The movie ID
  * @returns http POST request
  */


addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    if (!user.FavouriteMovies) {
      user.FavouriteMovies = []; // Initialize the array if it doesn't exist
    }
    user.FavouriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  


  

isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.FavouriteMovies) {
      user.FavouriteMovies = []; // Initialize the array if it doesn't exist
    }
    return user.FavouriteMovies.indexOf(movieId) >= 0;
  }

  


 
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    localStorage.removeItem('user'); // Clear the user from localStorage
    localStorage.removeItem('token'); // Clear the token from localStorage
    return this.http.delete(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  



 
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.FavouriteMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) { // only splice array when item is found
      user.FavouriteMovies.splice(index, 1); // 2nd parameter means remove one item only
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }





  
  



  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    }
    else if (error.error.errors) {
      return throwError(() => new Error(error.error.errors[0].msg));
    }
    else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}

























































