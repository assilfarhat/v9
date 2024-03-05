import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';

import { TpeService } from 'app/services/tpe.service';
import { AffilieService } from 'app/services/affilie.service';
import { StationsService } from 'app/services/stations.service';

@Component({
  selector: 'app-add-tpe',
  templateUrl: './add-tpe.component.html',
  styleUrls: ['./add-tpe.component.scss']
})
export class AddTpeComponent implements OnInit {

  idStation = this.route.snapshot.paramMap.get('id');
  form: FormGroup;
  submitted: boolean;
  isLoading: boolean = false;
  clients: any = [];
  FiltredStation: any = [];
  affils = [];
  stations: any = [];
  filtredStation: any;
  editMode = false;
  model = { SerialNumber: '', IdAffilie: '', idPointDeVente: '', availability: '' }
  constructor(private route: ActivatedRoute,

    private fb: FormBuilder,
    private toasterService: ToasterService,
    private router: Router,
    private affilService: AffilieService,
    private stationsService: StationsService,
    private tpeService: TpeService
  ) { }


  ngOnInit() {

    this.getStation();

    if (this.route.snapshot.paramMap.get('id')) {
      // edit
      this.editMode = true;
      this.getTpeBySerial(this.route.snapshot.paramMap.get('id'))

    } else {

      // add
      this.editMode = false;
      this.createform(this.model);
    }

    // this.getListStation()
    this.getAffils();

  }// end ngOnInit



  getTpeBySerial(id) {

    this.tpeService.getTpeBySerial(id).subscribe((data: any) => {
      this.model = data
      //console.log('this.modelTPe', this.model)
      this.createform(this.model)
    },
      err => { }
    );
  }

  createform(model) {
    this.form = this.fb.group({
      SerialNumber: [{ value: model.serialNumber, disabled: this.editMode }, [Validators.required, Validators.pattern('[0-9][0-9][0-9][-][0-9][0-9][0-9][-][0-9][0-9][0-9]')]],
      IdAffilie: [model.idAffilie],
      idPointDeVente: [model.idPointDeVente,],
      Availability: [model.availability],
      //idStation: this.idStation
    })
  }
  //
  checkAndSave() {
    this.submitted = true;

    if (!this.form.valid)
      return false;

    // console.log("fooorm " , this.form.value)
    this.form.controls.IdAffilie.setValue(this.stations.find(x => x.stationName == this.form.value.idPointDeVente).idAffilie)
    let form = this.form.getRawValue();


    this.isLoading = !this.isLoading;

    //console.log("form",form);
    if (!this.editMode) {
      this.tpeService.addTpe(form).subscribe((resp: any) => {
        //console.log("resp",resp);
        this.isLoading = !this.isLoading;

        this.router.navigate(['/Tpe/list'])
        if (!this.editMode)
          this.toasterService.pop('success', '', 'Le TPE a été créé avec succés');
        else
          this.toasterService.pop('success', '', 'Le TPE a été modifié avec succés');

      },
        () => {
          this.isLoading = !this.isLoading;

          this.toasterService.pop('error', '', 'Une erreur est survenue');
        });
    }
    else {
      //console.log("resp tpe update",form.SerialNumber);
      this.tpeService.updateTpe(form.SerialNumber, form).subscribe((resp: any) => {
        //console.log("resp tpe update",resp);
        this.isLoading = !this.isLoading;

        this.router.navigate(['/Tpe/list'])
        this.toasterService.pop('success', '', 'Le TPE a été modifié avec succés');


      },
        () => {
          this.isLoading = !this.isLoading;

          this.toasterService.pop('error', '', 'Une erreur est survenue');
        });
    }
  }// end checkAndSave




  getAffils() {
    this.affilService.List().subscribe((resp: any) => {
      this.affils = resp;
      //console.log(   this.dropdownList)

    });
  }


  getStation() {

    this.stationsService.GetStationsIdName().subscribe((resp: any) => {
      this.stations = resp
    },
      (err) => {
      });
  }


  filtreStations(id) {
    this.FiltredStation = [];

    this.form.patchValue({
      idPointDeVente: ''

    });
    if (id == "")
      return;

    this.FiltredStation = this.stations.filter(c => c.idAffilie == id)
    if (this.editMode)
      this.form.value.idPointDeVente = this.model.idPointDeVente
  }




  get f() { return this.form.controls; }



  changeStation() {
    //let station = this.stations.find(x => x.nom==this.stations.nom)
    // console.log("station", this.stations.find(x => x.nom == this.stations.nom));
  }

}// end class
