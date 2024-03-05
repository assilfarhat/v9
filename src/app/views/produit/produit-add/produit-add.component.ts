import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ProduitsService } from 'app/services/produits.service';
import { StationsService } from 'app/services/stations.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-produit-add',
  templateUrl: './produit-add.component.html',
  styleUrls: ['./produit-add.component.scss']
})
export class ProduitAddComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings = {};
  model={}
  editMode=false;
  form: any;
  ListFamillles: any;
isloadingEditProduit=false;

  constructor(    private toasterService: ToasterService,
    private route: ActivatedRoute,

    private router: Router, private fb: FormBuilder, private produitsService: ProduitsService, private stationService: StationsService) { }

  ngOnInit() {


    if (this.route.snapshot.paramMap.get('id')) {
      // edit
      this.editMode = true;
      this.getProduitById(this.route.snapshot.paramMap.get('id'))

    } else {
   
      // add
      this.editMode = false;


 this.createform(this.model);
    }
    this.selectedItems = [
      
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idStation',
      textField: 'nom',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 500,
      allowSearchFilter: true
    };
    this.getListFamillleProduits()

    this.getListstations()
    

  }

  getProduitById(id){

    this.produitsService.Get(id).subscribe( (data: any) => {
       this.model=data.produits
       this.selectedItems= data.stationsId

       this.createform( this.model)
       this.isloadingEditProduit=true;
    },
      err => {     }
    );
  }
  createform(model){
    this.form = this.fb.group({
      idProduit:[{value :model.idProduit, disabled: true}],
      dateCreation:[{value :model.dateCreation, disabled: true}],
      type: [{value :model.typeProduit, disabled: true}],
      famille: [{value :model.familleProduitId, disabled: true}],
      listStation: [this.selectedItems],
      produit: [{value :model.produit, disabled: true}],
      // prixUnitaireTtc: [model.prixUnitaireTtc],
      compteVente: [{value :model.compteVente, disabled: true}],
       tauxTaxe: [{value :model.tauxTaxe, disabled: true}],
      compteTaxe: [{value :model.produit, disabled: true}],
      typeAction:[this.editMode?"edit": 'add']
  })
  }
  get f(){ return this.form.controls };

  Ajouter() {
    this.produitsService.Add(this.form.getRawValue()).subscribe(
      
      data => {
        this.router.navigate(['/produits/list']);
        this.toasterService.pop('success', '', this.editMode?'le produit a été modifié avec succès': 'le produit a été ajouté avec succès');

      },(err) =>{
        // console.log(err)
        if(err.statusText== 'Conflict')
        this.toasterService.pop('error', 'code produit déja pris', );
        else 
        this.toasterService.pop('error', 'Une erreur est survenue', );
      }
   );
  }

  getListFamillleProduits(){
    this.produitsService.GetlistFamilleProduits()
        .subscribe((resp: any) => {
         this.ListFamillles=resp as []           
           

        });
}
getListstations(){
  this.stationService.List()
      .subscribe((resp: any) => {
       this.dropdownList=resp as []           
         

      });
}
 
onItemSelect(item: any) {
  //console.log(item);
}
onSelectAll(items: any) {
  //console.log(items);
}

SetValidtors(){
  if(this.form.controls.type.value=='Carburant'){
    this.form.get('famille').setValidators(Validators.required)
    this.form.get('famille').updateValueAndValidity();
  }
  else{
    this.form.controls.famille.setValue(null)
    this.form.get('famille').clearValidators()
    this.form.get('famille').updateValueAndValidity();
  }}

}
