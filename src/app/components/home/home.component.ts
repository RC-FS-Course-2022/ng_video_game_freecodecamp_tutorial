import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public sort = "";
  public games = new Array<Game>();
  private routeSub = new Subscription();
  private gameSub = new Subscription();

  constructor(private httpService: HttpService, private activatedRoute: ActivatedRoute, private router: Router) { }
  
  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
      }
    });
  }

  ngOnDestroy(): void {
    if(this.routeSub) {
      this.routeSub.unsubscribe();
    }

    if(this.gameSub) {
      this.gameSub.unsubscribe();
    }
  }

  searchGames(sort: string, search?: string): void {
    this.gameSub = this.httpService.getGameList(sort, search)
      .subscribe((gameList: APIResponse<Game>) => {
        this.games = gameList.results;
        // console.log(gameList);
        // console.log(this.games);
      });
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }
}
