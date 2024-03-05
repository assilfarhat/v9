import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {
  clientForm: any;
  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private clientService: ClientService) { }

  ngOnInit() {
    this.clientForm = this.fb.group({
      "idClient": "",
      "codeClient": "",
      "raisonSociale": "",
      "adresse": "",
      "ville": "",
      "codePostal": "",
      "contact": "",
      "responsable": "",
      "telephone": "",
      "email": "",
      "commission": "",
      "nomPerso": "",
      "prixRempCarte": ["", /*[Validators.min(50)]*/],
      "codeCorePass": "",
      "actif": 1,
      "enOpposition": 0,
      "exigerPin": 0,
      "plafonne": 0,
      "cumulable": 0,
      "dateExpiration": "",
      "cumul": "",
      "dateCreation": "",
      "reseauReduit": 0,
      "numCompte": "",
      "typeTax": "Client TTC",
      "registreCommerce": "",
      "envoiFacture": 1,
      "typeClient": "Prépayé",
      "dma": "0",
      "accesInternet": 0,
      "envoiRLD": 0,
      "remarque": "",
    });
    this.clientService.Get(this.route.snapshot.paramMap.get('id')).subscribe(
      data => {
        //console.log(data)
        this.clientForm.patchValue(data);
        //console.log(this.clientForm.value)
      }
      , err => alert("client inconnue")
    )
  }
  ModifierClient() {
    this.clientService.Edit(this.clientForm.value).subscribe(
      data => {
        this.router.navigate(['/client/list']);
      },
      err => { alert(err); }
    );
  }

}
