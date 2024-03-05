import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { AffilService } from 'app/services/affil.service';
import { TerminalService } from 'app/services/terminal.service';
import { TpeService } from 'app/services/tpe.service';
import { PointService } from 'app/services/point.service';

@Component({
  selector: 'app-declaration-terminal',
  templateUrl: './declaration-terminal.component.html',
  styleUrls: ['./declaration-terminal.component.scss']
})
export class DeclarationTerminalComponent implements OnInit {

  form: FormGroup;
  submitted: boolean;
  isLoading: boolean = false;
  affils:any=[];
  points:any=[];
  tpes:any=[];
  tpesAllAvailables:any=[];

  constructor(
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private router: Router,
    private affilService:AffilService,
    private terminalService:TerminalService,
    private tpeService:TpeService,
    private pointService:PointService
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
       IdTerminal : [ '', [ Validators.required, Validators.maxLength(16) ]] ,
       IdAffilie : [ '', [ Validators.required ]] ,
       IdPointDeVente : [ '', [ Validators.required ]],
      // IdBancaire : [ '', [ Validators.required]],
       Designation : [ '', [ Validators.required]],
      // CodeResponsable : [ '', [ Validators.required ]] ,
       SerialNumber : [ '', [ Validators.required]],
       EtatTerminal : [ '']
       
     })
 
   this.getAffils();
    this. getTpes();


  }


  checkAndSave() {
   

   
   
    this.submitted = true;

    if (!this.form.valid) 
    return false;

    let form=this.form.value;
    form.EtatTerminal==true? form.EtatTerminal=1:form.EtatTerminal=0;
    form.StatutReservation==true? form.StatutReservation=1:form.StatutReservation=0;



    //console.log("form",form);

      this.isLoading = !this.isLoading;

      this.terminalService.declare(form).subscribe((resp:any) => {
        //console.log("resp",resp);
        this.isLoading = !this.isLoading;
          if(resp.resultCode==0){
            this.router.navigate(['/terminal/list'])
            this.toasterService.pop('success', '', 'Le terminal a été déclaré avec succés');
          }else{
            this.toasterService.pop('error', '', 'Une erreur est survenue');

          }

                
      },
      () => {
        this.isLoading = !this.isLoading;

        this.toasterService.pop('error', '', 'Une erreur est survenue');
    });
  }// end checkAndSave

  getAffils(){
    this.affilService.getAll().subscribe((resp:any) => {
      //console.log("resp",resp)
      this.affils=resp.listOfAffilie;

    },
    (err) => {
    
  });
  }
  getPoints(id){
    this.points=[];
    this.tpes=[];

    this.form.patchValue({
      IdPointDeVente:'',
      SequenceNumber:''

    });

    if(id=="")
      return;

    this.pointService.getAll().subscribe((resp:any) => {
      //console.log("resp",resp)
    let pointsresp=resp.listOfPointDeVente;
    this.points = pointsresp.filter(c=>c.IdAffilie==id)
    },
    (err) => {
    
  });
  }

  getTpesByPoint(idPoint){
    this.tpes=[];

    this.form.patchValue({
      SequenceNumber:''

    });

    if(idPoint=="")
      return;

   this.tpes=this.tpesAllAvailables.filter(c=>c.IdPointDeVente==idPoint)
  }
  getTpes(){
    this.tpeService.getTpe().subscribe((resp:any) => {
      //console.log("resp",resp)
      this.tpesAllAvailables=resp.listOfTpe;
    },
    (err) => {
    
  });
  }
  get f() { return this.form.controls; } 

}
