import { Component, OnInit } from '@angular/core';
import { FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { AmountInputPipe } from 'app/pipes/amount-input-pipe.pipe';
import { AmountPipe } from 'app/pipes/amount.pipe';
import { AffilieService } from 'app/services/affilie.service';
import { CarteService } from 'app/services/carte.service';
import { JourferieService } from 'app/services/jourferie.service';
import { ProduitsService } from 'app/services/produits.service';
import { StationsService } from 'app/services/stations.service';
import { TokenService } from 'app/services/token.service';
import { ZoneGeographiqueService } from 'app/services/zone-geographique.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { identity } from 'rxjs';


@Component({
  selector: 'app-carte-settings',
  templateUrl: './carte-settings.component.html',
  styleUrls: ['./carte-settings.component.scss']
})
export class CarteSettingsComponent implements OnInit {

  listZone = []
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsZone: IDropdownSettings = {};
  dropdownSettingsJours: IDropdownSettings = {};
  dropdownSettingsJoursFerie: IDropdownSettings = {};
  dropdownSettingsStations: IDropdownSettings = {};
  model = {}
  editMode = false;
  form: any;
  ListFamillles: any;
  isloadingEdit = false;
  listaffiliation = [];
  produitsCarburant: any = [];
  produitsHCarburant: any = [];
  servicep: any = [];
  jours = [{ jour: 'lundi' }, { jour: 'mardi' }, { jour: 'mercredi' }, { jour: 'jeudi' }, { jour: 'vendredi' }, { jour: 'samedi' }, { jour: 'dimanche' }]
  listeJourFerie: any = [];
  listStation: any = [];
  filtredStation = []
  ActualUser: string = "";

  constructor(private tokenService: TokenService, private toasterService: ToasterService, private route: ActivatedRoute, private amountpipe: AmountInputPipe, private stationService: StationsService,
    private jourferieService: JourferieService,
    private router: Router, private fb: FormBuilder, private zoneGeographiqueService: ZoneGeographiqueService, private produitsService: ProduitsService, private carteService: CarteService) { }

  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
    this.getJourFerie();
    this.getListProduits();
    if (this.route.snapshot.paramMap.get('id'))
      this.getcartebyId(this.route.snapshot.paramMap.get('id'))

    this.selectedItems = [];
    this.dropdownSettingsStations = {
      singleSelection: false,
      idField: 'idStation',
      textField: 'nom',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 500,
      allowSearchFilter: true
    };

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idProduit',
      textField: 'produit',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 500,
      allowSearchFilter: true
    };

    this.dropdownSettingsJours = {
      singleSelection: false,
      idField: 'jour',
      textField: 'jour',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 500,
      allowSearchFilter: true
    };

    this.dropdownSettingsZone = {
      singleSelection: false,
      idField: 'zone',
      textField: 'zone',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 500,
      allowSearchFilter: true
    };
  }

  filtreStation() {
    this.f.Stations1.setValue([])
    this.filtredStation = []
    //console.log("listStation",this.listStation);
 
    this.f.zoneGeographique1.value.forEach(element => {
      let stations = this.listStation.filter(x => x.gouvernorat == element.zone)
      if (stations.length > 0)
        this.filtredStation.push.apply(this.filtredStation, stations)
    });
 }
 filtreStationInitial() {
    this.f.zoneGeographique1.value.forEach(element => {
      let stations = this.listStation.filter(x => x.gouvernorat == element.zone)
      if (stations.length > 0)
        this.filtredStation.push.apply(this.filtredStation, stations)
    });
 }

  SelectAllStation() {
    this.f.Stations1.setValue([])
    this.filtredStation = [...this.listStation]
  }

  ClearStation() {
    this.f.Stations1.setValue([])
    this.filtredStation = []
  }

  // getStationById(id){
  //   this.stationService.Get(id).subscribe( (data: any) => {
  //      this.model=data.stations
  //      this.selectedItems= data.produitsIds
  //      this.createform( this.model)
  //      this.isloadingEdit=true;
  //   },
  //     err => {     }
  //   );
  // }

  createform(model) {
    //console.log("model1",model)
    this.form = this.fb.group({
      Stations: [[]],
      Stations1: [model.stations1],
      client: [{ value: model.client, disabled: true }]
      , numCarte: [{ value: model.numCarte, disabled: true }]
      , nomPrenom: [{ value: model.nomPrenom, disabled: true }]
      , identifiant2: [{ value: model.identifiant2, disabled: true }]
      , typeCarte: model.typeCarte
      , plafondHebdoInitial: model.plafondHebdoInitial / 1000
      , plafondMensuelInitial: model.plafondMensuelInitial / 1000
      , clientPlafondMonsuel: { value: model.clientPlafondMonsuel, disabled: true }
      , flux: model.flux
      , plafondTrimestrielInitial: model.plafondTrimestrielInitial / 1000
      , plafondCarburantInitial: model.plafondCarburantInitial / 1000
      , zoneGeographique1: []
      , matricule: model.matricule
      , JoursFerie1: []
      , jours1: []
      , JoursFerie: ''
      , jours: ''
      , capaciteReservoir: model.capaciteReservoir
      , saisieKlm: model.saisieKlm
      , autoriserTransfert: model.autoriserTransfert
      , coutCarte: model.coutCarte
      , soldInitial: model.soldInitial
      , fraisCarte: model.fraisCarte
      , plafondHorsCarburantInitial: model.plafondHorsCarburantInitial /1000
      , plafondAutreInitial: model.plafondAutreInitial /1000
      , partionnerPlafond: model.partionnerPlafond / 1000
      , montantAutochargement: model.montantAutochargement
      , autochargement: model.autochargement
      , plafondJournalierInitial: model.plafondJournalierInitial /1000
      , produitcarburant: model.produitcarburant
      , produithorsCarburant: model.produithorsCarburant
      , serviceP: model.serviceP
      , tag: model.tag
      , numTag: model.numTag,
      heurDebut: model.heurDebut,
      heurFin: model.heurFin,
      zoneGeographique: '',
      soldMaximal: model.soldMaximal,
      //this.amountpipe.transform(model.plafondPaiementInitial),
      plafondPaiementInitial: model.plafondPaiementInitial /1000,
      clientPlafondMonsuelDispo:[{ value: model.clientPlafondMonsuelDispo / 1000, disabled: true}]
    })

    // if (model.flux == 'prépayé') {
    //   //console.log(this.form.get('plafondMensuelInitial'))
    //   //console.log("khaoula")
    //   this.form.get('plafondMensuelInitial').setValidators(Validators.required,Validators.max(model.clientPlafondMonsuelDispo / 1000))
    //   this.form.get('plafondMensuelInitial').updateValueAndValidity()
    //   this.form.get('plafondHebdoInitial').setValidators(Validators.required,Validators.max(model.clientPlafondMonsuelDispo / 1000))
    //   this.form.get('plafondJournalierInitial').setValidators(Validators.required,Validators.max(model.clientPlafondMonsuelDispo / 1000))
    //   this.form.get('plafondPaiementInitial').setValidators(Validators.required)
    //   this.form.get('plafondTrimestrielInitial').setValidators(Validators.required)
    // }

    //console.log(this.form.get('plafondMensuelInitial'))
    //console.log("khaoula")
    if (model.typeCarte != 'prépayé') {
      //console.log("modelpré",this.form)
      this.form.get('plafondMensuelInitial') 
      this.form.get('plafondMensuelInitial').updateValueAndValidity()
      this.form.get('plafondHebdoInitial')
      this.form.get('plafondJournalierInitial') 
      this.form.get('plafondPaiementInitial') 
      this.form.get('plafondTrimestrielInitial') 
      //this.form.get('plafondHorsCarburantInitial').setValidators(Validators.required)
      //this.form.get('plafondAutreInitial').setValidators(Validators.required)
      //  this.form.get('plafondCarburantInitial').setValidators(Validators.required)
      this.form.get('jours1').setValidators(Validators.required)
    }
    if (model.typeCarte == 'prépayé') {
      //console.log("modelpré",this.form)
      this.form.get('plafondMensuelInitial') 
      this.form.get('plafondHebdoInitial') 
      this.form.get('plafondJournalierInitial') 
      this.form.get('plafondPaiementInitial') 
      this.form.get('plafondTrimestrielInitial')
      this.form.get('numTag')
      //this.form.get('plafondHorsCarburantInitial').setValidators(Validators.required)
      //this.form.get('plafondAutreInitial').setValidators(Validators.required)
      //this.form.get('plafondCarburantInitial').setValidators(Validators.required)
      this.form.get('jours1').setValidators(Validators.required)
    }
  }
  get f() { return this.form.controls };


  getListstations() {
    this.stationService.List()
      .subscribe((resp: any) => {
        this.listStation = resp as []
      });
  }


  Ajouter() {
    let formvalue = this.form.getRawValue()
    //console.log("testform",formvalue)
    if (formvalue.zoneGeographique1) {
      formvalue.zoneGeographique1.forEach(element => {
        formvalue.zoneGeographique += element.zone + ","
      });
    }
    if (formvalue.jours1) {
      formvalue.jours1.forEach(element => {
        formvalue.jours += element.jour + ","
      });
    }
    if (formvalue.JoursFerie1) {
      formvalue.JoursFerie1.forEach(element => {
        formvalue.JoursFerie += element.jour + ","
      });
    }
    if (formvalue.Stations1) {
      formvalue.Stations1.forEach(element => {
        let stationCarte = { idStation: element.idStation, numCarte: formvalue.numCarte }
        formvalue.Stations.push(stationCarte)
      });
    }
    //console.log(formvalue.soldMaximal== "0.000")
    formvalue.soldMaximal = formvalue.soldMaximal == "0.000" ? 0 : formvalue.soldMaximal
    formvalue.montantAutochargement = formvalue.montantAutochargement
    formvalue.plafondAutreInitial = formvalue.plafondAutreInitial
    formvalue.plafondHorsCarburantInitial = formvalue.plafondHorsCarburantInitial
    //console.log('plafondHorsCarburantInitial', formvalue.plafondHorsCarburantInitial)
    formvalue.fraisCarte = formvalue.fraisCarte
    formvalue.soldInitial = formvalue.soldInitial
    formvalue.coutCarte = formvalue.coutCarte
    formvalue.plafondCarburantInitial = formvalue.plafondCarburantInitial
    formvalue.plafondTrimestrielInitial = formvalue.plafondTrimestrielInitial
    formvalue.plafondMensuelInitial = formvalue.plafondMensuelInitial
    formvalue.plafondHebdoInitial = formvalue.plafondHebdoInitial
    formvalue.plafondJournalierInitial = formvalue.plafondJournalierInitial
    formvalue.plafondPaiementInitial = formvalue.plafondPaiementInitial
    formvalue.numTag= formvalue.numTag

    this.carteService.CarteSettings(formvalue).subscribe(

      (data: any) => {
        //console.log("data", formvalue);
        if (data.codeRetour == "1") {
          alert("terminal deja pris");
        }
        else
          this.router.navigate(['/carte/list']);
        this.toasterService.pop('success', '', 'la carte  a été modifié avec succès');
      }, (err) => {
        this.toasterService.pop('error', 'Une erreur est survenue',);
      }
    );
  }


  getcartebyId(id) {
    this.carteService.CateEtStation(id).subscribe((data: any) => {
      //console.log("data", data);
      var resp = data[0]
      this.listStation = data[1]
      this.listZone = data[2]
      this.createform(resp);
      let zoneGeographique = []
      let jours = []
      let jourFerie = []
      if (resp.zoneGeographique) {
        resp.zoneGeographique.split(',').forEach(element => {
          if (element != "")
            zoneGeographique.push({ zone: element })
        });
      }

      if (resp.jours) {
        resp.jours.split(',').forEach(element => {
          if (element != "")
            jours.push({ jour: element })
        });

      }
      if (resp.jourFerier) {
        resp.jourFerier.split(',').forEach(element => {
          if (element != "")
            jourFerie.push({ jour: element })
        });
      }
      //console.log('this.createform(resp);',this.createform(resp))
      this.form.patchValue({
        produithorsCarburant: resp.produithorsCarburant,
        zoneGeographique1: zoneGeographique,
        JoursFerie1: jourFerie,
        jours1: jours,
        numTag : resp.numTag,
        produitcarburant: resp.produitcarburant,
        /* plafondHorsCarburantInitial : resp.plafondHorsCarburantInitial, */
        serviceP: resp.serviceP,
      })
      this.filtreStationInitial()
    });
  }

  getZoneGeographique() {
    this.zoneGeographiqueService.get().subscribe((resp: any) => {
      this.listZone = resp;
    });
  }
  getJourFerie() {
    this.jourferieService.get().subscribe((resp: any) => {
      this.listeJourFerie = resp;
    });
  }
  onItemSelect(item: any) {
    ////console.log(item);
  }
  onSelectAll(items: any) {
    ////console.log(items);
  }


  getListProduits() {

    this.produitsService.ListByType()
      .subscribe((resp: any) => {
        this.produitsCarburant = resp.carburant as []
        this.produitsHCarburant = resp.hcarburant as []
        this.servicep = resp.service as []
        //console.log('produittt', this.servicep)
      },
        (err) => {

        }
      );
  }


 
}
