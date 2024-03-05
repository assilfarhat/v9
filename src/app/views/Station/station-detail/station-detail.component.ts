import { Component, OnInit } from '@angular/core';
import { StationsService } from 'app/services/stations.service';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss']
})
export class StationDetailComponent implements OnInit {
  station: any
  idStation: string

  ActualUser: string = "";

  constructor(private stationsService: StationsService, private tokenService: TokenService
  ) { 

  }
  ngOnInit() {

     this.ActualUser = this.tokenService.getRole();
    this.idStation = this.tokenService.getUser().idStation;
    ////console.log("ActualUser",this.ActualUser);
    
    const parts = this.idStation.split('-');
    const valeurExtraite = parts[0].trim();
    //console.log("teststationnntokenService",valeurExtraite)
    this.idStation =valeurExtraite ;
    this.getStation();
  }

  getStation() {

    this.stationsService.Get(this.idStation)
      .subscribe((resp: any) => {

        this.station = resp.stations
        //console.log("teststationnn",this.station)
      },
        (err) => {

        }
      );
  }
}
