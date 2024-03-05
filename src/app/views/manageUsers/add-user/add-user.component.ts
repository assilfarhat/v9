import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User, TokenService } from 'app/services/token.service';
import { UserService } from 'app/services/user.service';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { requiredBy } from 'app/compare';
import { StationsService } from 'app/services/stations.service';
import { ClientService } from 'app/services/client.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private stationsService: StationsService,
    private toasterService: ToasterService,
    private clientService: ClientService) { }
  user: any;
  roles: any;
  stations: any;
  organizations: any = [];
  form: FormGroup;
  submitted: boolean;
  isLoading: boolean = false;
  userRole: any;
  userOrg: any;
  hasError = false;
  errorMessage: any;
  organizationsInit: any;
  roleX: any;
  listMerchant: any;
  listMagasin: any;
  lang: any;
  clients: any;
  Porteur: any;
  Porteurs: any;
  banks: any;
  merchants: any;
  magasins: any;
  orgUser;
  merchantsOrgs: any = [];
  magasinsOrgs: any = [];
  StationList: any = [];



  ngOnInit() {
    this.userRole = this.tokenService.getRole();
    // console.log("this.userRole",this.userRole)
    this.userOrg = this.tokenService.getOrgnaisation();
    this.lang = this.tokenService.getLang();
    this.form = this.fb.group({
      lastname: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      phonenumber: new FormControl('', [Validators.required, Validators.pattern('[1-9][0-9]{7}')]),
      role: new FormControl('', [Validators.required]),
      organizationId: new FormControl(''),
      idStation: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      idclient: new FormControl(''),
      idPorteur: new FormControl(''),
      marchand: new FormControl(''),
      magasin: new FormControl('')
    },
      {
        //validator:[requiredBy('role',['MAGASIN','MERCHANT'],'marchand'),requiredBy('role',['MAGASIN'],'magasin'),requiredBy('role',['SUPERVISEUR','ADMIN ORGANISME','ADMIN MSS'],'organizationId')]
        //validator:[requiredBy('role','MAGASIN','marchand'),requiredBy('role','MAGASIN','magasin')]
      })


    //====================
    this.userService.getListRoles().subscribe(
      (list: any) => {
        this.roles = list.filter(e => e != "ADMIN MSS" && e != "USER BANK" && e != "MERCHANT" && e != "MAGASIN");
      }
    )
    //====================
    this.stationsService.getAllStation().subscribe(
      (list: any) => {
        this.stations = list;
      }
    )

    this.clientService.GetActiveClients().subscribe(
      (list: any) => {
        this.clients = list;
        //console.log("clients", this.clients)
      }
    )

    

    this.userService.getListOrgansitaion().subscribe(
      (list) => {

        this.organizationsInit = list;

      }
    );
    //=========================

    this.getBanks();
    this.getMerchants();
    this.getMagsins();
    this.chargerStationList();


  }// end ngOnInit


  chargerStationList() {
    this.stationsService.GetStationsIdName().subscribe(
      res => {
        this.StationList = res as []
      //console.log("StationList", this.StationList)
      }
    )
  }


  getCurrentClient(id: any) {
    this.clientService.GetListePorteur().subscribe(
      (list: any) => {
        this.Porteurs = list;
        //console.log("Porteur", this.Porteurs);
        this.Porteur = this.Porteurs.filter(e => e.idClient == this.IdClient);
        // console.log("Porteur", this.IdClient);
      }
    )
  }


  getOrganisation(id: any) {
    this.form.patchValue({
      marchand: '',
      magasin: '',
      organizationId: ''
    });
    this.merchantsOrgs = []
    this.magasinsOrgs = [];
    this.organizations = [];
    this.listMagasin = [];
    this.roleX = this.form.get('role').value;
    // console.log("roleX", this.roleX)
    this.orgUser = this.tokenService.getOrgnaisation();
    if (id == "USER BANK") {
      this.organizations = this.banks
    }
    
    if (id == "MERCHANT") {
      this.organizations = this.organizationsInit.filter(e => ((e.type == "Bank") || (e.type == "SMT") || (e.type == "MSS")))
      if (this.userRole == "ADMIN ORGANISME") {
        if (this.orgUser.length > 0) {
          this.organizations = this.organizationsInit.filter(e => ((e.id == this.orgUser[0].id)))
        }
      }
    }

    if (id == "MAGASIN") {

      this.organizations = this.organizationsInit.filter(e => ((e.type == "Bank") || (e.type == "SMT") || (e.type == "MSS")))
      if (this.userRole == "ADMIN ORGANISME") {
        if (this.orgUser.length > 0) {
          this.organizations = this.organizationsInit.filter(e => ((e.id == this.orgUser[0].id)))
        }
      }
    }

    if (id == "ADMIN MSS") {
      this.organizations = this.organizationsInit.filter(e => (e.type == "MSS"))
    }

    if ((id == "ADMIN ORGANISME")) {
      //this.organizations=this.organizationsInit.filter(e=>((e.type=="Bank")||(e.type=="SMT")))
      this.organizations = this.banks;
      if (this.organizations.find(c => c.id == "SMT") == undefined)
        this.organizations.push({ id: "SMT", name: "SMT" });
    }
    if ((id == "SUPERVISEUR")) {

      //this.organizations=this.organizationsInit.filter(e=>((e.type=="Bank")||(e.type=="SMT")||(e.type=="MSS")))
      this.organizations = this.banks
      if (this.organizations.find(c => c.id == "SMT") == undefined)
        this.organizations.push({ id: "SMT", name: "SMT" });


      if (this.userRole != "ADMIN MSS") {
        if (this.orgUser.length > 0) {
          this.organizations = this.organizationsInit.filter(e => ((e.id == this.orgUser[0].id)))
        }
      }

    }
    if ((id == "ADMIN ORGANISME") && (this.userRole == "ADMIN ORGANISME")) {
      let organizations = this.banks;

      if (this.orgUser.length > 0) {
        this.organizations = organizations.filter(e => ((e.id == this.orgUser[0].id)))
      }

    }
  }

  checkAndSave() {
    this.submitted = true;
    if(this.roleX=='GERANT')
    {this.form.controls['idStation'].setValidators([Validators.required])
    this.form.controls['idStation'].updateValueAndValidity();}

    else if(this.roleX=='CLIENT'||this.roleX=='PORTEUR')
    {this.form.controls['idclient'].setValidators([Validators.required])
    this.form.controls['idclient'].updateValueAndValidity();}

    else if(this.roleX=='PORTEUR')
    {this.form.controls['idPorteur'].setValidators([Validators.required])
    this.form.controls['idPorteur'].updateValueAndValidity();}
    else {
      this.form.controls['idStation'].clearValidators()
      this.form.controls['idStation'].updateValueAndValidity();
      this.form.controls['idPorteur'].clearValidators()
      this.form.controls['idPorteur'].updateValueAndValidity();
      this.form.controls['idclient'].clearValidators()
      this.form.controls['idclient'].updateValueAndValidity();
    }

    if (this.form.valid) {
      this.isLoading = !this.isLoading;
      let userToAdd = this.form.value;
      //console.log("useeer",userToAdd)
      userToAdd.OrganizationsId = [];

      if (this.form.get('role').value != 'MERCHANT' && this.form.get('role').value != 'MAGASIN') {
        userToAdd.OrganizationsId.push(this.form.get('organizationId').value);
        userToAdd.Type = 3;
      }

      if (this.form.get('role').value == 'MERCHANT') {
        userToAdd.organizationId = this.form.get('marchand').value;
        userToAdd.OrganizationsId = this.merchantsOrgs;
        userToAdd.Type = 4;
      }
      if (this.form.get('role').value == 'MAGASIN') {
        userToAdd.organizationId = this.form.get('magasin').value;
        //userToAdd.OrganizationsId.push(userToAdd.organizationId);
        userToAdd.OrganizationsId = this.magasinsOrgs;
        userToAdd.Type = 5;
      }
      this.userService.addUser(userToAdd).subscribe(() => {
        this.router.navigate(['/list/users'])
        if (this.lang == 'fr') {
          this.toasterService.pop('success', '', 'L\'utilisateur a été crée avec succès')
        }
        else {
          this.toasterService.pop('success', '', 'The user has been successfully created')
        }

      },
        (err:any) => {
          this.isLoading = !this.isLoading;
          this.hasError = true;
          this.errorMessage = err.error.value;
         //console.log(this.errorMessage);
        }

      )

    }
  }

  getMagasinByMerchant(id: any) {
    this.listMagasin = [];
    this.magasinsOrgs = [];

    this.form.patchValue({
      magasin: ''
    });
    if (id == '')
      return;


    this.listMagasin = this.magasins.filter(e => (e.gwMagasinMerchantId == id))


  }
  get f() { return this.form.controls; }
  get IdClient() { return this.form.get('idclient').value };
  get lastname() { return this.form.get('lastname') };
  get firstname() { return this.form.get('firstname') };
  get userName() { return this.form.get('userName') };
  get idclient() { return this.form.get('idclient') };
  get phonenumber() { return this.form.get('phonenumber') };
  get role() { return this.form.get('role') };
  get organizationId() { return this.form.get('organizationId') };
  get email() { return this.form.get('email') };
  get magasin() { return this.form.get('magasin') };
  get marchand() { return this.form.get('marchand') };
  get idStation() { return this.form.get('idStation') };




  //
  getBanks() {

  }

  getMerchants() {

  }

  getMagsins() {

  }




  setMerchant(idMerchant) {
    if (this.form.get('role').value == 'MERCHANT') {
      let index = 0;

      if (idMerchant != "")
        index = this.merchantsOrgs.find(c => c == idMerchant);

      if (index == undefined) {
        //let contrat = this.listMerchant.find(c=>c.IdContrat==idMerchant);
        this.merchantsOrgs.push(idMerchant);
      }
    }
  }
  deleteMerchant(i) {
    //let index = this.contratsAff.find(c=>c.Type==typeContrat);
    if (i > -1) {
      this.merchantsOrgs.splice(i, 1);
    }

  }

  //


  setMagasin(idMagasin) {
    if (this.form.get('role').value == 'MAGASIN') {
      let index = 0;

      if (idMagasin != "")
        index = this.magasinsOrgs.find(c => c == idMagasin);

      if (index == undefined) {
        //let contrat = this.listMerchant.find(c=>c.IdContrat==idMerchant);
        this.magasinsOrgs.push(idMagasin);
      }
    }
  }
  deleteMagasin(i) {
    //let index = this.contratsAff.find(c=>c.Type==typeContrat);
    if (i > -1) {
      this.magasinsOrgs.splice(i, 1);
    }

  }

}
