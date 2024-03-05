import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { PorteurService } from 'app/services/porteur.service';
import { ClientService } from 'app/services/client.service';
import { TerminalService } from 'app/services/terminal.service';
import { AffilService } from 'app/services/affil.service';
import { PointService } from 'app/services/point.service';
import { TpeService } from 'app/services/tpe.service';
import { AffilieService } from 'app/services/affilie.service';
import { StationsService } from 'app/services/stations.service';
import { Console, log } from 'console';

@Component({
  selector: 'app-add-terminal',
  templateUrl: './add-terminal.component.html',
  styleUrls: ['./add-terminal.component.scss']
})
export class AddTerminalComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  isLoading: boolean = false;
  oldTerminal: any ; 
  affils: any = [];
  points: any = [];
  tpes: any = [];
  tpesAllAvailables: any = [];

  constructor(private route: ActivatedRoute,

    private fb: FormBuilder,
    private toasterService: ToasterService,
    private router: Router,
    private affilService:AffilieService,
    private stationsService:StationsService,
    private terminalService:TerminalService ,
    private tpeService:TpeService
  ) { }

  clients: any = [];
  FiltredStation: any = [];
  stations: any = [];
  filtredStation: any;
  editMode = false;
  model = {}
  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id'))
      // edit
      this.editMode = true;
      else 
      // add
      this.editMode = false;

      this.form = this.fb.group({
      IdTerminal : new FormControl({value:"", disabled: this.editMode}, [ Validators.required, Validators.maxLength(12)]) ,
      
      IdAffilie : new FormControl({value:""}),
      IdStation :new FormControl({value:""},Validators.required),//[model.idStation, Validators.required],
      SerialNumber : new FormControl({value:""},Validators.required),//[ model.serialNumber,Validators.required],
      IdBancaire : new FormControl({value:""}),
      EtatTerminal : new FormControl({value:""}),
      DateCreation : new FormControl({value:""}),
      ConfVersion : new FormControl({value:""}),
      BinaryVersion : new FormControl({value:""}),
      WithBalance : new FormControl({value:""}),
      BatchNumber : new FormControl({value:""}),
      SequenceNumber : new FormControl({value:""}),
      DatePremiereOp : new FormControl({value:""}),
      Designation : new FormControl({value:""}, [ Validators.required, Validators.maxLength(16)]) ,
      CodeResponsable : new FormControl({value:""}),
      StatutReservation : new FormControl({value:""}),
      telephone: new FormControl({value:"", disabled: this.editMode}),
      DateStatutReservation : new FormControl({value:""}),

    })
    this.getStation();
    if (this.route.snapshot.paramMap.get('id')) {
      // edit
      this.editMode = true;
      this.getTerminalById(this.route.snapshot.paramMap.get('id'))

    } else {

      // add
      this.editMode = false;

      this.createform(this.model);
    }


    // this.getAffils();
    //  this. getTpes();
  }// end ngOnInit





  getTerminalById(id){

    this.terminalService.get(id).subscribe((resp:any) => {
this.createform(resp)
        },
    (err) => {
    
  });
  }


  getStation(){
    
    this.stationsService.List().subscribe((resp:any) => {
      this.stations=resp
        },
    (err) => {
    
  });
  }

  createform(model){
    this.geTpeDisponibleByStation(model.idStation)
    this.form.controls['IdTerminal'].setValue(model.idTerminal);
    this.form.controls['IdAffilie'].setValue(model.idAffilie);
    this.form.controls['IdStation'].setValue(model.idStation);
    this.form.controls['SerialNumber'].setValue(model.serialNumber);
    this.form.controls['IdBancaire'].setValue(model.idBancaire);
    this.form.controls['EtatTerminal'].setValue(model.etatTerminal);
    this.form.controls['DateCreation'].setValue(model.dateCreation);
    this.form.controls['ConfVersion'].setValue(model.confVersion);
    this.form.controls['BinaryVersion'].setValue(model.binaryVersion);
    this.form.controls['WithBalance'].setValue(model.withBalance);
    this.form.controls['BatchNumber'].setValue(model.batchNumber);
    this.form.controls['SequenceNumber'].setValue(model.sequenceNumber);
    this.form.controls['DatePremiereOp'].setValue(model.datePremiereOp);

    this.form.controls['Designation'].setValue(model.designation);
    this.form.controls['CodeResponsable'].setValue(model.codeResponsable);
    this.form.controls['StatutReservation'].setValue(model.statutReservation);
    this.form.controls['telephone'].setValue(model.statutReservation);
    this.form.controls['DateStatutReservation'].setValue(model.dateStatutReservation);
      // this.form = this.fb.group({
      //   IdTerminal : [{  value:model.idTerminal,disabled : this.editMode}, [ Validators.required, Validators.maxLength(12)  ]] ,
        
      //   IdAffilie : [ model.idAffilie, ],
      //   IdStation :[model.idStation, Validators.required],
      //   SerialNumber : [ model.serialNumber,Validators.required],
      //   IdBancaire : [ model.idBancaire,],
      //   EtatTerminal : [ model.etatTerminal,],
      //   DateCreation : [ model.dateCreation,],
      //   ConfVersion : [ model.confVersion,],
      //   BinaryVersion : [ model.binaryVersion,],
      //   WithBalance : [ model.withBalance,],
      //   BatchNumber : [ model.batchNumber,],
      //   SequenceNumber : [ model.sequenceNumber,],
      //   DatePremiereOp : [ model.datePremiereOp,],
      //   Designation : [ model.designation,[ Validators.required, Validators.maxLength(16) ]],
      //   CodeResponsable : [ model.codeResponsable,],
      //   StatutReservation : [ model.statutReservation,],
      //   telephone: [ {value :model.telephone, disabled:this.editMode},],

      //   DateStatutReservation : [ model.dateStatutReservation,]

      // })
  }

  checkAndSave() {
    this.submitted = true;

    if (!this.form.valid)
      return false
      // console.log(this.stations.find(x=>x.idStation==this.form.value.IdStation).idAffilie)
      this.form.controls.IdAffilie.setValue(this.stations.find(x=>x.idStation==this.form.value.IdStation).idAffilie)
                                                                                             
    let form = this.form.getRawValue();
 
    form.EtatTerminal == true ? form.EtatTerminal = 1 : form.EtatTerminal = 0;
    form.WithBalance == true ? form.WithBalance = 1 : form.WithBalance = 0;

    form.StatutReservation == true ? form.StatutReservation = 1 : form.StatutReservation = 0;
    this.isLoading = !this.isLoading;
    // console.log(form)
    if(!this.editMode){
  this.terminalService.add(form).subscribe((resp: any) => {
    this.isLoading = !this.isLoading;
    if (resp.resultCode == 0) {
      this.router.navigate(['/Terminal/list'])
      if(!this.editMode)
      this.toasterService.pop('success', '', 'Le terminal a été créé avec succés');
      else
      this.toasterService.pop('success', '', 'Le terminal a été modifié avec succés');

    } else if (resp.resultCode == 1) {
      this.toasterService.pop('error', '', 'Id terminal déja exist');
      
    }
 else {
      this.toasterService.pop('error', '', 'Une erreur est survenue');

    }

  },
    () => {
      this.isLoading = !this.isLoading;

      this.toasterService.pop('error', '', 'Une erreur est survenue');
    });
}
else {
  this.terminalService.update(form.IdTerminal, form).subscribe((resp: any) => {
    this.isLoading = !this.isLoading;
    if (resp.resultCode == 0) {
      //console.log("this.respTer",resp);
      //this.oldTerminal = resp.oldTerminal;
      //console.log("this.oldTerminal",this.oldTerminal);
      
      this.router.navigate(['/Terminal/list'])
      this.toasterService.pop('success', '', 'Le terminal a été modifié avec succés');
    } else {
      this.toasterService.pop('error', '', 'Une erreur est survenue');

    }


  },
    () => {
      this.isLoading = !this.isLoading;

      this.toasterService.pop('error', '', 'Une erreur est survenue');
    });
}
   
  }// end checkAndSave

  

  geTpeDisponibleByStation(event:any){
    //console.log(event);
    
    this.form.controls['SerialNumber'].setValue("");
    this.tpeService.geTpeDisponibleByStation(event).subscribe((resp:any) => {
      this.tpes=resp
      
        },
    (err) => {
    
  });
  }


   get f() { return this.form.controls; } 

}// end class
