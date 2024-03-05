import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { PorteurService } from '../../../services/porteur.service';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-porteur-add',
  templateUrl: './porteur-add.component.html',
  styleUrls: ['./porteur-add.component.scss']
})
export class PorteurAddComponent implements OnInit {

  porteurForm: any;
  clientList: any;
  editMode=false;
  porteur
  constructor(private route: ActivatedRoute,

    private router: Router,  private fb: FormBuilder, private porteurService: PorteurService, private clientService: ClientService) { }

  ngOnInit() {

    if (this.route.snapshot.paramMap.get('id')) {
      // edit
      this.editMode = true;
      this.getPorteurById(this.route.snapshot.paramMap.get('id'))

    } else {
   
      // add
      this.editMode = false;
this.porteur={


  "idPorteur": "",
  "idClient": "",
  "idGroupe": "",
  "cin": "",
  "matricule": "",
  "nom": "",
  "contact": "",
  "region": "",
  "dateNaissance": "",
  "civilite": 0,
  "numeroGsm": "",
  "adresseEmail": "",
  "accepteSms": 0,
  "accepteEmail": 0,
  "dateCreation": "",
  "statut": 0,
  "idZoneGeographique": "",
  "nbrCards": 1
}
   
 this.createform(this.porteur);

}


    this.getClientList();


  }



  createform(model){
    this.porteurForm = this.fb.group({
      "idPorteur": model.idPorteur,
      "numCarte": [   {value: model.numCarte, disabled: true} ],
      "idClient": [   {value: model.idClient, disabled: true} ],
      "idGroupe": model.idGroupe,
      "cin": [   {value: model.cin, disabled: true} ],
      "matricule": [   {value: model.matricule, disabled: true} ],
      "nom": [   {value: model.nom, disabled: true} ],
      "identifiant2": [   {value: model.identifiant2, disabled: true} ],
      "nomPrenom": [   {value: model.nomPrenom, disabled: true} ],
      "contact":  [   {value: model.contact, disabled: true} ],
      "region": [   {value: model.region, disabled: true} ],
      "dateNaissance": [   {value: model.dateNaissance, disabled: true} ],
      "civilite": model.civilite,
      "numeroGsm": [   {value: model.numeroGsm, disabled: true} ],
      "adresseEmail": model.adresseEmail,
      "accepteSms": model.accepteSms,
      "accepteEmail": model.accepteEmail,
      "dateCreation": model.dateCreation,
      "statut": model.statut,
      "idZoneGeographique":model.idZoneGeographique,
      "nbrCards": model.nbrCards,

    });
  }
  getPorteurById(id){
    this.porteurService.GetPorteurById(id).subscribe(data => {
this.createform(data)   }) 
  }



  AjouterPorteur() {
    this.porteurForm.patchValue({
      "accepteSms": this.porteurForm.value.accepteSms ? 1 : 0,
      "accepteEmail": this.porteurForm.value.accepteEmail ? 1 : 0,

    })
    if(this.editMode){
      this.porteurService.update(this.porteurForm.getRawValue()).subscribe(

        data => {
          this.router.navigate(['/carte/list']);
        },
        err => {  }
      );
    }
    else{
    this.porteurService.Add(this.porteurForm.value).subscribe(

      data => {
        this.router.navigate(['/porteur/list']);
      },
      err => { alert(err.error); }
    );
  }}
  getClientList() {
    this.clientService.List().subscribe(data => {
      this.clientList = data
    })
 }
}
