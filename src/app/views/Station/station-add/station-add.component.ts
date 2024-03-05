import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastComponent, ToasterService } from 'angular2-toaster';
import { AffilieService } from 'app/services/affilie.service';
import { ProduitsService } from 'app/services/produits.service';
import { StationsService } from 'app/services/stations.service';
import { ZoneGeographiqueService } from 'app/services/zone-geographique.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
@Component({
  selector: 'app-station-add',
  templateUrl: './station-add.component.html',
  styleUrls: ['./station-add.component.scss']
})
export class StationAddComponent implements OnInit {


  dropdownList = [];
  selectedItems = [];
  TpeIds =[];
  TpeIds1 :any = '';
  TpeIds2 :any = '';
  TpeIds0:any = '';
  dropdownSettings: IDropdownSettings = {};
  model = {}
  editMode = false;
  form: any;
  ListFamillles: any;
  isloadingEdit = false;
  listaffiliation = [];
  listZone: any;
  constructor(private toasterService: ToasterService, private route: ActivatedRoute, private zoneGeographiqueService: ZoneGeographiqueService,

    private router: Router, private fb: FormBuilder, private affilieService: AffilieService, private produitsService: ProduitsService, private stationService: StationsService) { }

  ngOnInit() {
    this.getZoneGeographique()
    this.getListaffiliations()
    this.getListproduit()

    if (this.route.snapshot.paramMap.get('id')) {
      // edit
      this.editMode = true;
      this.getStationById(this.route.snapshot.paramMap.get('id'))

    } else {

      // add
      this.editMode = false;
      this.createform(this.model );
    }

    this.selectedItems = [

    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idProduit',
      textField: 'produit',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 500,
      allowSearchFilter: true
    };



  }
  getZoneGeographique() {
    this.zoneGeographiqueService.get().subscribe((resp: any) => {
      this.listZone = resp;
    });
  }

  getStationById(id) {

    this.stationService.Get(id).subscribe((data: any) => {
      //console.log("  data", data)
      this.model = data.stations
      this.selectedItems = data.produitsIds
      this.TpeIds = data.tpeIds
      //console.log('test !!!!!',this.TpeIds);
  
        if(data.tpeIds.length == 1){
          this.TpeIds0= data.tpeIds[0].serialNumber
          //console.log('TpeIds0',this.TpeIds0);
          
        }
        
        if(data.tpeIds.length == 2){
          this.TpeIds0= data.tpeIds[0].serialNumber
          this.TpeIds1= data.tpeIds[1].serialNumber
      
        }
        if(data.tpeIds.length >= 3){
          this.TpeIds0= data.tpeIds[0].serialNumber
          this.TpeIds1= data.tpeIds[1].serialNumber
          this.TpeIds2= data.tpeIds[2].serialNumber
      }
      else if(data.tpeIds.length > 3){
        this.TpeIds0= data.tpeIds[0].serialNumber
        this.TpeIds1= data.tpeIds[1].serialNumber
        this.TpeIds2= data.tpeIds[2].serialNumber
      }

        
      /////console.log(" this.TpeIds= data.TPEIds", this.TpeIds)

      this.createform(this.model)
      this.isloadingEdit = true

    },
      err => { }
    );
  }

  createform(model) {
    
    
      this.form = this.fb.group({
        idStation: new FormControl({ value: model.idStation, disabled: true }),
        dateCreation: new FormControl({ value: model.dateCreation, disabled: true }),
        nom: new FormControl({ value: model.nom, disabled: true }),
        adresse: new FormControl({ value: model.adresse, disabled: true }),
        actif: new FormControl({ value: model.actif, disabled: true }),
        nomGerant: new FormControl({ value: model.nomGerant, disabled: true }),
        email: new FormControl({ value: model.email, disabled: true }),
        gsm: new FormControl({ value: model.gsm, disabled: true }),
        fixe: new FormControl({ value: model.fixe, disabled: true }),
        fax: new FormControl({ value: model.fax, disabled: true }),
        accessInternet: new FormControl({ value: model.accessInternet, disabled: true }),
        zoneGeographique: new FormControl({ value: model.zoneGeographique, disabled: true }),
        compteFacturartion: new FormControl({ value: model.compteFacturartion, disabled: true }),
        depot: new FormControl({ value: model.depot, disabled: true }),
        creditMax: new FormControl({ value: model.creditMax, disabled: true }),
        matriculeFiscal: new FormControl({ value: model.matriculeFiscal, disabled: true }),
        idAffilie: new FormControl({ value: model.idAffilie, disabled: true }),
        idTerminal: new FormControl({ value: model.idTerminal, disabled: true }),
        serialNumber: new FormControl({ value: model.serialNumber, disabled: true }),
        listProduit: new FormControl(this.selectedItems),
        commissionParMargePourcentage: new FormControl(model.commissionParMargePourcentage),
        commissionParMarge: new FormControl({ value: model.commissionParMarge, disabled: !model.commissionParMargePourcentage }),
        commissionParVolumePourcentage: new FormControl(model.commissionParVolumePourcentage),
        commissionParVolume: new FormControl({ value: model.commissionParVolume, disabled: !model.commissionParVolumePourcentage }),
        pourcentageComission: new FormControl(model.pourcentageComission),
        commissionParservice: new FormControl(model.commissionParservice),
        commissionParlubrifiant: new FormControl(model.commissionParlubrifiant),
        enteteTpe: new FormControl(model.enteteTpe),
        ligne1Tpe: new FormControl({ value: this.TpeIds0, disabled: true }),
        ligne2Tpe: new FormControl({ value: this.TpeIds1, disabled: true }),
        ligne3Tpe: new FormControl({ value: this.TpeIds2, disabled: true })
      });
      
   
  
  
  }



  get f() { return this.form.controls };

  Ajouter() {
    this.stationService.Add(this.form.getRawValue()).subscribe(
      (data: any) => {
        if (data.codeRetour == "1") {
          this.toasterService.pop('error', '', ' Affiliation deja pris');
        }
        else{
          this.router.navigate(['/stations/list']);

        if (this.editMode)
          this.toasterService.pop('success', '', ' la station a  été modifiée  avec succès');
        else
          this.toasterService.pop('success', '', ' la station a  été ajoutée  avec succès');
        }
      }, (err) => {

        this.toasterService.pop('error', 'Une erreur est survenue',);
      }
    );
  }

  getListaffiliations() {
    this.affilieService.List().subscribe((resp: any) => {
      this.listaffiliation = resp as []
      //console.log(   this.dropdownList)

    });
  }
  getListproduit() {
    this.produitsService.ListProduit()
      .subscribe((resp: any) => {
        this.dropdownList = resp as [];
      });
  }

  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }

  showMarge(event1) {
    if(this.f.commissionParMargePourcentage.value){
      this.form.patchValue({
        commissionParVolumePourcentage: false,
        commissionParVolume : ""
      });
      this.form.controls['commissionParVolume'].disable();
      this.form.controls['commissionParMarge'].enable();
    }else{
      this.form.patchValue({
        commissionParMarge : ""
      });
    }
  }

  showVolume(event2) {
    if(this.f.commissionParVolumePourcentage.value){
      this.form.patchValue({
        commissionParMargePourcentage: false,
        commissionParMarge : ""
      });
      this.form.controls['commissionParMarge'].disable();
      this.form.controls['commissionParVolume'].enable();
    }else{
      this.form.patchValue({
        commissionParVolume : ""
      });
    }
  }
}