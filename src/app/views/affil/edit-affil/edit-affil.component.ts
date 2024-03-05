import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { AffilService } from 'app/services/affil.service';
import { PointService } from 'app/services/point.service';

@Component({
  selector: 'app-edit-affil',
  templateUrl: './edit-affil.component.html',
  styleUrls: ['./edit-affil.component.scss']
})
export class EditAffilComponent implements OnInit {


  form: FormGroup;
  submitted: boolean;
  isLoading: boolean = false;
  id: any;
  defaultVal: any;
  affil: any = {};
  mccs: any = [];
  constructor(
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private affilService: AffilService,
    private pointService: PointService
  ) { }


  ngOnInit() {
    this.getMCC();
    this.id = this.route.snapshot.params['id'];
    this.form = this.fb.group({
      //  CodeAffilie : [ '', [ Validators.required ]] ,
      CodeCorePass: ['', [Validators.required]],
      Nom: ['', [Validators.required]],
      Adresse: ['', [Validators.required]],
      Ville: ['', [Validators.required]],
      CodePostal: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      Contact: ['', [Validators.required]],
      Responsable: ['', [Validators.required]],
      Activite: ['', [Validators.required]],
      //Activite : [ '', [ Validators.required]],
      //Famille : [ '', [ Validators.required]],
      RaisonSocial: ['', [Validators.required]],
      //Groupe : [ '', [ Validators.required ]] ,
      Gouvernorat: ['', [Validators.required]],
      Actif: [''],
      //Decote : [ '', [ Validators.required ,Validators.pattern('[0-9]')]],

      VisibilieMobile: [''],
    })

    this.affilService.getAffil(this.id).subscribe((resp: any) => {
      this.affil = resp;
      this.defaultVal = this.affil.Famille;
      ////console.log("resp",resp);
      //console.log('Activité : ' + this.affil.Activite);
      //console.log('Famille  : ' + this.affil.Famille);
      this.form.patchValue({

        CodeCorePass: this.affil.CodeCorePass,
        Nom: this.affil.Nom,
        Adresse: this.affil.Adresse,
        Ville: this.affil.Ville,
        CodePostal: this.affil.CodePostal,
        Contact: this.affil.Contact,
        Responsable: this.affil.Responsable,
        Activite: this.affil.Famille,

        RaisonSocial: this.affil.RaisonSocial,

        Gouvernorat: this.affil.Gouvernorat,
        Actif: this.affil.Actif,
        //Decote : this.affil.Decote,

        VisibilieMobile: this.affil.VisibilieMobile,
      });
    });

  }// end ngOnInit



  getMCC() {
    this.pointService.getMCC().subscribe((resp: any) => {
      //console.log(resp)
      this.mccs = resp.listOfMcc;
      //console.log(this.mccs)
    })
  }


  //
  checkAndSave() {

    this.submitted = true;

    if (!this.form.valid)
      return false;

    let form = this.form.value;
    form.Actif == true ? form.Actif = 1 : form.Actif = 0;

    form.VisibilieMobile == true ? form.VisibilieMobile = 1 : form.VisibilieMobile = 0;
    form.IdAffilie = this.affil.IdAffilie;

    //console.log("form",form);

    this.isLoading = !this.isLoading;

    this.affilService.update(this.id, form).subscribe((resp: any) => {
      //console.log("resp",resp);
      this.isLoading = !this.isLoading;
      if (resp.resultCode == 0) {
        this.router.navigate(['/affil/list'])
        this.toasterService.pop('success', '', 'L\'affilié a été modifié avec succès');
      } else {
        this.toasterService.pop('error', '', 'Code Core Passe utilisé !!');

      }

    },
      () => {
        this.isLoading = !this.isLoading;

        this.toasterService.pop('error', '', 'Une erreur est survenue');
      });
  }// end checkAndSave


  get f() { return this.form.controls; }

}// end class
