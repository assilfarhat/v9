import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CarteService } from 'app/services/carte.service';
import { ClientService } from 'app/services/client.service';
import { ProduitsService } from 'app/services/produits.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
@Component({
  selector: 'app-carte-add',
  templateUrl: './carte-add.component.html',
  styleUrls: ['./carte-add.component.scss']
})
export class CarteAddComponent implements OnInit {
  listGroup: any;
  dtTrigger = new Subject();
  dtOptions: any = {};
  form: FormGroup;
  formGroupes: FormGroup;
  TarifList: any = [];
  selectedgroup
  @ViewChild('deleteModal') deleteModal;
  user: any = JSON.parse(localStorage.getItem('user'));
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  ClientList = []
  fraistag
  produitsCarburant: any = [];
  produits: any;
  dropdownSettings: IDropdownSettings = {};
  idClient = ''
  addFromClient: boolean = false;
  nbCarte: any;
  nbCarteIntial: 0;
  fraisCarteCheck: boolean = false;
  nbCarteCree: 0;
  fluxPs = ""
  constructor(private route: ActivatedRoute, private router: Router,
    private produitService: ProduitsService, private clientService: ClientService, private fb: FormBuilder, private toasterService: ToasterService, private carteService: CarteService) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.idClient = this.route.snapshot.paramMap.get('id')
      this.addFromClient = true
    }
    this.chargerTarif();
    this.getListProduits()

    this.chargerClientList()
    this.formGroupes = this.fb.group({
      groups: this.fb.array([]),
    });
    this.dropdownSettings = {
      // singleSelection: true,
      singleSelection: false,
      idField: 'idProduit',
      textField: 'produit',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 500,
      allowSearchFilter: true,
    };
    this.addNewGroup();
  }

  chargerClientList() {
    this.clientService.GetActiveClients().subscribe(
      res => {
        this.ClientList = res as []
        if (this.route.snapshot.paramMap.get('id')) {
          this.changeClient()
        }
      }
    )
  }

  chargerTarif() {
    this.carteService.GetTarif().subscribe(
      res => {
        this.TarifList = res;
        // this.TarifList = res[0] ;


       //console.log("this.TarifList", this.TarifList)
      }
    )
  }

  getListProduits() {
    this.produitService.ListByType().subscribe((resp: any) => {
      this.produits = resp.produitCH as []
     // console.log("produittt", this.produits);
    },
      (err) => {
      }
    );
  }

  // getListProduits() {
  //   this.produitService.ListByType()
  //     .subscribe((resp: any) => {
  //       this.produitsCarburant = resp.carburant as []
  //      // this.produitsHCarburant = resp.hcarburant as []
  //     },
  //       (err) => {

  //       }
  //     );
  // }

  deleteRow(index) {
    this.groupsForms.removeAt(index);
  }

  changeClient() {
    //console.log("test change client")
    this.groupsForms.clear();
    let client = this.ClientList.find(x => x.idClient == this.idClient.substring(0, this.idClient.indexOf(" -")))

    this.nbCarteCree = client.nbCarteCree
   // console.log("nbCarteCree = ", this.nbCarteCree)

    this.nbCarte = client.nbCarteCree
   // console.log("nbCarteMax = ", this.nbCarte)

    // this.nbCarteIntial = client.nbCarteCree + client.nbCarteMaxIntial
    this.nbCarteIntial = client.nbCarteMaxIntial



    this.fluxPs = client.fluxPs ? "Activé" : "désactivé"

    //console.log(this.ClientList.find(x => x.idClient == this.idClient))
  }

  addNewGroup() {
   // console.log(Number(this.nbCarte))

   // console.log(this.groupsForms.length)
    if (Number(this.nbCarteIntial - this.nbCarte) > this.groupsForms.length) {
      const group = this.fb.group({
        "identifiant": [, Validators.required],
        identifiant2: '',
        matricule: [,],
        "produit": [, Validators.required],
       
        fraisCarteCheck: [false,],
        fraisCarte:[],
        typeCarte: [, Validators.required],
        "numTAG": [],
        tag: [false,],
        fraisTagCheck: [false,],
        fraisTag: [],
        saisieKlm: [false,],
        flux: [, Validators.required],
      });
      this.groupsForms.insert(0, group)
    }
  }



  changeToEditOrDelete(form) {
    form.patchValue({ Action: "update" })
  }

  save() {
   // console.log("this.groupsForms.value", this.groupsForms.value);
    if (this.groupsForms.invalid)
      return

    var model = { clientId: this.idClient.substring(0, this.idClient.indexOf(" -")), Cartes: this.groupsForms.value }
    this.carteService.AddCartEnMass(model).subscribe(async (res: any) => {
      if (this.addFromClient)
        this.router.navigate(['/client/list']);
      else
        this.router.navigate(['/carte/list']);
      this.toasterService.pop('success', '', "cartes ajoutées avec succès")
    },
      (err) => {
        this.toasterService.pop(err)
        //console.log(err)
      })
  }

  get groupsForms() {
    return this.formGroupes.get('groups') as FormArray;
  }

  // get saisieKlm() { return this.formGroupes.get('saisieKlm'); }

  showKlm(index) {
    //console.log(this.groupsForms.controls[index]['controls'].saisieKlm.value)
    if (this.groupsForms.controls[index]['controls'].saisieKlm.value)
      this.groupsForms.controls[index]['controls'].klm.setValidators(Validators.required)
    else {
      this.groupsForms.controls[index]['controls'].klm.clearValidators();
      this.groupsForms.controls[index]['controls'].klm.setValue('');
    }
  }

  showMatriculation(index) {
    if (this.groupsForms.controls[index]['controls'].typeCarte.value == "Matricule")
      this.groupsForms.controls[index]['controls'].matricule.setValidators([Validators.required, Validators.minLength(6)])
    else {
      this.groupsForms.controls[index]['controls'].matricule.clearValidators();
      this.groupsForms.controls[index]['controls'].matricule.setValue('');
    }
  }

  showtag(index) {
    if (this.groupsForms.controls[index]['controls'].typeCarte.value == "tag")
      this.groupsForms.controls[index]['controls'].numTAG.setValidators([Validators.required])
    else {
      this.groupsForms.controls[index]['controls'].numTAG.clearValidators();
      this.groupsForms.controls[index]['controls'].numTAG.setValue('');
    }
  }

  showfraisTag(index) {
    if (this.groupsForms.controls[index]['controls'].typeCarte.value == "fraisTagCheck")
      this.groupsForms.controls[index]['controls'].fraisTag.setValidators([Validators.required])
    else {
      this.groupsForms.controls[index]['controls'].fraisTag.clearValidators();
      this.groupsForms.controls[index]['controls'].fraisTag.setValue('');
    }
  }


  showfraisCarte(index) {
    if (this.groupsForms.controls[index]['controls'].typeCarte.value == "fraisCarteCheck")
      this.groupsForms.controls[index]['controls'].fraisCarte.setValidators([Validators.required])
    else {
      this.groupsForms.controls[index]['controls'].fraisCarte.clearValidators();
      this.groupsForms.controls[index]['controls'].fraisCarte.setValue('');
    }
  }
}
