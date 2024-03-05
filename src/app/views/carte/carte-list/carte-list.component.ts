import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from 'angular2-toaster';
import { AmountPipe } from 'app/pipes/amount.pipe';
import { CarteService } from 'app/services/carte.service';
import { ClientService } from 'app/services/client.service';
import { SoldeCarteService } from 'app/services/solde-carte.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';
import { CompareAmounts, CompareDates, } from 'app/shared/Validators';
import { TokenService } from 'app/services/token.service';
import { Console } from 'console';

interface AccessView {
  idUser: string;
  idAccessView: string;
  valueUserAccess: number;
  action: string;
  valueAccessView: boolean;
}

@Component({
  selector: 'app-carte-list',
  templateUrl: './carte-list.component.html',
  styleUrls: ['./carte-list.component.scss']
})
export class CarteListComponent implements OnInit {
  @ViewChild('desactivateModal') desactivateModal;
  @ViewChild('desactivateModalS') desactivateModalS;
  @ViewChild('activateModal') activateModal;
  @ViewChild('dmdActivateModal') dmdActivateModal;
  @ViewChild('RechargeModal') RechargeModal;
  @ViewChild('ReplaceModal') ReplaceModal;
  @ViewChild('RenouvelmentModal') RenouvelmentModal;
  @ViewChild('TransfertPPModal') TransfertPPModal
  @ViewChild('TransfertPSModal') TransfertPSModal
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;


  Rechrgeform: FormGroup;
  TransfertRechrgeform: FormGroup;
  TransfertPSform: FormGroup;
  isLoading: boolean = false;
  form: FormGroup;
  submitted: boolean;
  dtOptions: any = {};
  dtTrigger = new Subject();
  reclamations: any[] = [];
  selectedFile: any;
  action
  selectedCarte
  ListFamillles: any = [];
  carteList: any = [];
  ClientList: any = [];
  currentDate = new Date().toDateString();
  soldePP: any;
  soldePS: any;
  soldePPE: any;
  idClient: string;
  addFromClient: boolean = false;
  statusPsP: boolean;
  statusPPE: boolean;
  statusPP: boolean;
  ActivePPCarte: any = [];
  dropdownSettings: IDropdownSettings = {};
  dateActivation:any;
  selectedCarteToTransfert
  carteToTransfert: any;
  ActivePSCarte: any;
  selectedPP = []
  selectedPS = []
  dateString: string;
  dateString2: string
  date: Date;
  isAdmin = false;
  //accesView: any = []

  //Zone variable pour la gestion des etats
  show = false;
  ListdetailCarte: any = []
  DetailEnteteCarte: any = [];
  SelectedClient: string;
  SelectedDate: string;
  SelectedNameClient: string;
  SelectedIdClient: string;
  ActualUser: string = "";
  accessView: any;
  access: any;
  ajout: any;
  bloquesolde: any;
  bloqueCarte: any;
  accessvalue: any;
  accessvalueBloquesolde: any;
  accessvalueBloqueCarte: any;
  configCarte: any;
  accessconfigCarte: any;
  detailCarte: any;
  accessDetailCarte: any;
  miseEnPosition: any;
  accessMiseEnPosition: any;
  modifCarte: any;
  accessModifCarte: any;
  rechargeCarte: any;
  accessrechargeCarte: any;
  replaceCarte: any;
  accessReplaceCarte: any;
  demandeActivation: any;
  accessdemandeActivation: any;
  renouvelerCarte: any;
  accessRenouvelerCarte: any;
  transfertSolde: any;
  accessTransfertSolde: any;
  activationCarte: any;
  accessActivationCarte: any;
  telecharge:any;
  acesstelecharge:any;
  PlafondTemporaire :any;
  accessPlafondT:any;


  constructor(private tokenService: TokenService, private router: Router, private amountpipe: AmountPipe, private route: ActivatedRoute, private toasterService: ToasterService, private SoldeCarteService: SoldeCarteService,
    private fb: FormBuilder, private carteService: CarteService, private clientService: ClientService,
    private datePipe: DatePipe,
    private tokensService: TokenService) {
    //this.currentDate = this.datePipe.transform(this.currentDate, 'MM-dd-yyyy');
  }

  params: any

  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
    this.accessView = this.tokenService.getAccess();
  
      this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Carte');
      this.activationCarte = this.access[0].action
      this.accessActivationCarte = this.access[0].valueAccessView
      this.ajout = this.access[1].action
      this.accessvalue = this.access[1].valueAccessView
      this.bloquesolde = this.access[2].action
      this.accessvalueBloquesolde = this.access[2].valueAccessView
      this.bloqueCarte = this.access[3].action
      this.accessvalueBloqueCarte = this.access[3].valueAccessView
      this.PlafondTemporaire = this.access[4].action
      this.accessPlafondT = this.access[4].valueAccessView
      this.configCarte = this.access[5].action
      this.accessconfigCarte = this.access[5].valueAccessView
      this.demandeActivation = this.access[6].action
      this.accessdemandeActivation = this.access[6].valueAccessView
      this.detailCarte = this.access[7].action
      this.accessDetailCarte = this.access[7].valueAccessView
      this.miseEnPosition = this.access[8].action
      this.accessMiseEnPosition = this.access[8].valueAccessView
      this.modifCarte = this.access[9].action
      this.accessModifCarte = this.access[9].valueAccessView
      this.rechargeCarte = this.access[10].action
      this.accessrechargeCarte = this.access[10].valueAccessView
      this.replaceCarte = this.access[11].action
      this.accessReplaceCarte = this.access[11].valueAccessView
      this.renouvelerCarte = this.access[12].action
      this.accessRenouvelerCarte = this.access[12].valueAccessView
      this.telecharge = this.access[13].action
      this.acesstelecharge = this.access[13].valueAccessView
      this.transfertSolde = this.access[14].action
      this.accessTransfertSolde = this.access[14].valueAccessView
      //console.log("acceessView", this.access);
    







    if (this.tokensService.getRole() == "ADMIN STAROIL") {
      this.isAdmin = true;
    }

    this.route.queryParams.subscribe((params) => {
      this.params = params
    });

    this.date = new Date();
    this.dateString = this.datePipe.transform(this.date, "MM-dd-yyyy")
    this.dateString2 = this.datePipe.transform(new Date(this.date.getFullYear(), this.date.getMonth(), 1), "MM-dd-yyyy")


    this.dropdownSettings = {
      singleSelection: true,
      idField: 'numCarte',
      textField: 'nomNumCarte',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      itemsShowLimit: 1,

      allowSearchFilter: true
    };


    if (this.route.snapshot.paramMap.get('id')) {
      this.idClient = this.route.snapshot.paramMap.get('id')
      this.addFromClient = true
    }

    this.form = this.fb.group({
      clientId: [this.idClient ? this.idClient : this.params['clientId'] == undefined ? '' : this.params['clientId']],
      statut: [this.params['statut'] == undefined ? '' : this.params['statut']],
      TypeCarte: [this.params['TypeCarte'] == undefined ? '' : this.params['TypeCarte']],
      dateFin: [this.params['dateFin'] == undefined ? this.dateString : this.params['dateFin']],
      dateDebut: [this.params['dateDebut'] == undefined ? this.dateString : this.params['dateDebut']],
      "Date": this.dateString,
      dateCreation: [''],
      dateActivation : [''],
    }
      // ,
      // {
      //   validator: [

      //     CompareDates(
      //       'dateDebut'
      //       , 'dateFin'
      //     )
      //   ]


      // }
    )
    this.chargerClientList();

    //console.log("datastring", this.dateString);

    this.getListCarte();

    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
      searching: true,
      serverSide: false,
      language: {
        processing: "Traitement en cours...",
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donn&eacute;e disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": Activer pour trier la colonne par ordre croissant",
          sortDescending: ": Activer pour trier la colonne par ordre d&eacute;croissant"
        }
      },
      buttons: [
        {
          extend: 'print',
          title: 'liste des cartes '
        },
        {
          extend: 'excel',
          title: 'liste des cartes '
        }
      ]
    };

    // let table = $('#example').DataTable({
    //   drawCallback: () => {


    //     console.log("calback")
    //     $('.paginate_button.next')
    //       .on('click', () => {
    //         this.nextButtonClickEvent();
    //       });
    //   }
    // });
  }

  // nextButtonClickEvent(): void {
  //      console.log('next clicked');
  // }


  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes);  }


  selectCarteForTransfert(item) {
    this.selectedCarteToTransfert = item
    this.carteToTransfert = this.ActivePPCarte.find(x => x.numCarte == this.selectedCarteToTransfert.numCarte)
    this.TransfertRechrgeform = this.fb.group({
      compteDomestiqueE: [this.selectedCarte.compteDomestique, Validators.required],
      compteDomestiqueR: [this.carteToTransfert.compteDomestique, Validators.required],
      NumCarteE: [this.selectedCarte.numCarte, Validators.required],
      NumCarteR: [this.carteToTransfert.numCarte, Validators.required],
      ClientId: [this.selectedCarte.idClient, Validators.required],
      montantPP: [{ value: 0, disabled: !this.selectedCarte.soldePP || (this.carteToTransfert.statutPP == '1' || this.selectedCarte.statutPP == '1') }, [Validators.max(this.selectedCarte.soldePP)]],
      montantPPE: [{ value: 0, disabled: !this.selectedCarte.soldePPE || (this.carteToTransfert.statutPPE == '1' || this.selectedCarte.statutPPE == '1') }, [Validators.max(this.selectedCarte.soldeCartePPE)]],

    })
  }
  getlistacces() {
    const carteSubList = this.accessView.filter(item => item.idAccessView === 'Carte');
    //console.log("carteSubList", carteSubList);

  }
  selectCartePPForTransfertPS(item) {
    this.selectedPS = []

    this.selectedCarteToTransfert = item
    this.carteToTransfert = this.ActivePPCarte.find(x => x.numCarte == this.selectedCarteToTransfert.numCarte)

    //console.log(this.carteToTransfert)
    //console.log(this.selectedCarte)
    this.TransfertPSform = this.fb.group({
      NumCarteE: [this.selectedCarte.numCarte, Validators.required],
      NumCarteR: [this.carteToTransfert.numCarte, Validators.required],
      ClientId: [this.selectedCarte.idClient, Validators.required],
      compteDomestiqueE: [this.selectedCarte.compteDomestique, Validators.required],
      compteDomestiqueR: [this.carteToTransfert.compteDomestique, Validators.required],
      montantPS: [0, [Validators.max(this.selectedCarte.soldeCartePsP)]],
    })
  }

  selectCartePSForTransfert(item) {
    this.selectedPP = []
    this.selectedCarteToTransfert = item
    this.carteToTransfert = this.ActivePSCarte.find(x => x.numCarte == this.selectedCarteToTransfert.numCarte)
    this.TransfertPSform = this.fb.group({
      NumCarteE: [this.selectedCarte.numCarte, Validators.required],
      NumCarteR: [this.carteToTransfert.numCarte, Validators.required],
      ClientId: [this.selectedCarte.idClient, Validators.required],
      compteDomestiqueE: [this.selectedCarte.compteDomestique, Validators.required],
      compteDomestiqueR: [this.carteToTransfert.compteDomestique, Validators.required],
      montantPS: [0, [Validators.max(this.selectedCarte.plafondMensuel)]],
    })
  }

  selectCarte(item, action?) {
    this.TransfertPSform = null;
    this.selectedPP = []
    this.selectedPS = []
    this.selectedCarte = item
    //console.log("rabani",this.selectedCarte )
    if (action)
      this.action = action
  }

  chargerClientList() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientList = res as []
        //console.log("clienttt", this.ClientList)
      }
    )
  }

  ReplaceCarte() {
    this.carteService.ReplaceCarte(this.selectedCarte.numCarte).subscribe(
      res => {
        this.getListCarte();
        this.ReplaceModal.hide();
        this.toasterService.pop('success', '', 'la carte a été remplacée avec succès');

        (err) => {
          this.toasterService.pop('error', '', 'une erreur est servenue');

        }
      }
    )
  }

  RenouvlerCarte() {
    this.carteService.RenouvlerCarte(this.selectedCarte.numCarte).subscribe(
      res => {
        this.RenouvelmentModal.hide();
        this.toasterService.pop('success', '', 'la carte a été renouvelée avec succès');
        (err) => {
          this.toasterService.pop('error', '', 'une erreur est servenue');
        }
      }
    )
  }

  getSoldeCarteClient(item, action) {
   
   
   
    
      this.soldePP = {}
      this.soldePPE = {}
      this.soldePS = {}
      this.selectCarte(item);
      this.SoldeCarteService.getSoldeCartePPAndClient(item.compteDomestique, item.idClient).subscribe(
        (res: any) => {
          this.soldePP = res.listSoldeCarteClient.find(x => x.typeCompteClient == 20)
          this.soldePPE = res.listSoldeCarteClient.find(x => x.typeCompteClient == 21)
          // this.soldePS =res.listSoldeCarteClient.find(x=>x.typeCompteClient==22)
          if (action == "bloquée") {
            this.statusPP = this.soldePP.statusCarte == "0" ? false : true
            this.statusPPE = this.soldePPE.statusCarte == "0" ? false : true
            // this.statusPsP=this.soldePS.statusCarte=="0"? false : true
            this.desactivateModalS.show();
          }
          else {
            this.Rechrgeform = this.fb.group({
              montantRecharchePP: [{ value: 0, disabled: !this.soldePP || (this.soldePP.soldeReelDisponibleClient == 0 || this.soldePP.statusCarte == '1' || this.soldePP.statusClient == '1') }, [Validators.max(Number(this.soldePP))]],
              montantRecharchePPE: [{ value: 0, disabled: !this.soldePPE || (this.soldePPE.soldeReelDisponibleClient == 0 || this.soldePPE.statusCarte == '1' || this.soldePPE.statusClient == '1') }, Validators.max(Number(this.soldePPE))],
              // montantRecharchePsP: [ {value :0, disabled : !this.soldePS || (this.soldePS.soldeReelDisponibleClient==0 ||this.soldePS.statusCarte=='1'|| this.soldePS.statusClient=='1')}, Validators.max(Number(this.amountpipe.transform(this.soldePS.soldeReelDisponibleClient)))] ,

            })
            this.RechargeModal.show();
          }
        }
      )
    
  }

  BloquerDebloquerS() {
    let item = {
      statusPP: this.statusPP ? "1" : 0,
      statusPPE: this.statusPPE ? "1" : 0,
      statusPsP: this.statusPsP ? "1" : 0,
      compteDomestique: this.selectedCarte.compteDomestique,
    }
    this.carteService.BloquerDebloquer(item).subscribe(
      res => {
        // var carte =this.carteList.find(x=>x.numCarte==this.selectedCarte.numCarte)
        // carte.statutCarte=='0'? carte.statutCarte='1' : ( carte.statutCarte=='1'? carte.statutCarte='0' : carte.statutCarte=carte.statutCarte)
        this.toasterService.pop('success', '', 'la carte a été ' + this.action + ' avec succès');
        this.desactivateModalS.hide();
        this.getListCarte()
      },
      (err) => {
        this.toasterService.pop('error', '', 'une erreur est servenue');

      }
    )
  }
  dmdActiver() {
    this.carteService.dmdActiver(this.selectedCarte.numCarte).subscribe(
      res => {
        this.toasterService.pop('success', '', "la demande d'activation est effectué avec succès");
        this.dmdActivateModal.hide();
      },
      (err) => {
        this.toasterService.pop('error', '', 'une erreur est servenue');
        this.dmdActivateModal.hide();
      }
    )
  }

  activer() {

    this.carteService.activer(this.selectedCarte.numCarte).subscribe(
      (res:any) => {

        //console.log('resssss',res.date);
        
        var carte = this.carteList.find(x => x.numCarte == this.selectedCarte.numCarte)
        //console.log("cartecartecarte1",carte);
        carte.statutCarte = '0'
        carte.descriptionStatus = 'Active'
       // this.dateActivation=carte.dateActivation  
        carte.dateActivation  = res.date
       // console.log("dateActivation",this.dateActivation);
        //console.log("cartecartecarte2",carte);
        
        this.toasterService.pop('success', '', 'la carte a été activée avec succès');
        this.activateModal.hide();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 200);
        //   if(this.action=='bloquée')
        //   this.desactivateModal.hide()
        // else  if(this.action=='débloquée')
        //   this.activateModal.hide()

      },
      (err) => {
        this.toasterService.pop('error', '', 'une erreur est servenue');

      }
    )
  }

  getListCarte() {
    this.router.navigate(['/carte/list'], {
      queryParams: {
        clientId: this.form.value.clientId,
        statut: this.form.value.statut,
        TypeCarte: this.form.value.TypeCarte,
        // dateFin:  this.datePipe.transform(this.form.value.dateFin, "MM-dd-yyyy"),
        // dateDebut: this.datePipe.transform(this.form.value.dateDebut, "MM-dd-yyyy"),
      }
    })

    this.isLoading = true
    this.carteList = []
    this.reinitialiser();

    let search = JSON.parse(JSON.stringify(this.form.value))

    // console.log("date debut : " + this.form.value.dateDebut)
      search.dateDebut = this.form.value.dateDebut ? this.datePipe.transform(this.form.value.dateDebut, "yyyyMMdd") + '000000' : '1000010100000',
      search.dateFin = this.form.value.dateFin ? this.datePipe.transform(this.form.value.dateFin, "yyyyMMdd") + '235959' : '99990101235959',
      search.dateCreation = this.form.value.dateCreation ? this.form.value.dateCreation.replace(/-/g, ''): '';
      search.dateActivation = this.form.value.dateActivation ? this.form.value.dateActivation.replace(/-/g, ''): '';

       this.carteService.List(search)
        .subscribe((resp: any) => {
          //console.log("resp: " ,resp)
          this.carteList = resp as []
          this.dtTrigger.next();
          this.isLoading = false;
        },
          (err) => {
            this.isLoading = false;
          }
        );
  }

  GetActivePPCarteByClient(item) {
    this.ActivePPCarte = [];
    this.selectedCarteToTransfert = null;
    this.carteService.GetActivePPCarteByClient(item.idClient, item.numCarte)
      .subscribe((resp: any) => {
        this.ActivePPCarte = resp as [];
        this.TransfertPPModal.show()
          , (err) => {

          }
      }
      );
  }

  async reinitialiser() {
    if (this.dtElement) {
      let dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.rows().remove().draw();;
        dtInstance.destroy();
      }
    }
  }
  TransfertPP() {
    var recharge = this.TransfertRechrgeform.getRawValue()
    this.SoldeCarteService.TransfertPP(recharge).subscribe(
      (res: any) => {
        if (res.resultCode == "0") {


          this.getListCarte();
          this.toasterService.pop('success', '', 'la solde a été transferé  avec succès');
          this.TransfertPPModal.hide()
        }
        else {
          this.toasterService.pop('error', '', 'Solde inssufisant');
          this.TransfertPPModal.hide()
        }
      },
      (err) => {
        this.toasterService.pop('error', '', 'une erreur est servenue');
      }
    )
  }

  TransfertPS() {
    var recharge = this.TransfertPSform.getRawValue()
    this.SoldeCarteService.TransfertPS(recharge).subscribe(
      (res: any) => {
        if (res.resultCode == "0") {
          this.getListCarte();
          this.toasterService.pop('success', '', 'la solde a été transferé  avec succès');
          this.TransfertPSModal.hide()
        }
        else {
          this.toasterService.pop('error', '', 'Solde inssufisant');

          this.TransfertPSModal.hide()
        }
        this.TransfertPSform = null;
        this.selectedPP = []
        this.selectedPS = []
      },
      (err) => {
        this.toasterService.pop('error', '', 'une erreur est servenue');
      }
    )
  }

  rechargerCarte() {
    var recharge = this.Rechrgeform.getRawValue()
    recharge.numCarte = this.selectedCarte.numCarte
    recharge.compteDomestique = this.selectedCarte.compteDomestique
    recharge.idClient = this.selectedCarte.idClient
    this.SoldeCarteService.RechargerCarte(recharge).subscribe(
      (res: any) => {
        if (res.resultCode == "0") {
          this.getListCarte();
          this.toasterService.pop('success', '', 'la carte a été rechargée avec succès');
          this.RechargeModal.hide()
        }
        else {
          this.toasterService.pop('error', '', 'Solde inssufisant');
          this.RechargeModal.hide()
        }
      },
      (err) => {
        this.toasterService.pop('error', '', 'une erreur est servenue');
      }
    )
  }

  BloquerDebloquer() {
    this.carteService.BloquerActiver(this.selectedCarte.numCarte).subscribe(
      res => {
        var carte = this.carteList.find(x => x.numCarte == this.selectedCarte.numCarte)
        carte.statutCarte = '7'
        carte.descriptionStatus = 'Bloqué'
        this.toasterService.pop('success', '', 'la carte a été ' + this.action + ' avec succès');
        this.desactivateModal.hide()
      })
  }

  GetActiveCarteByClient(item) {
    this.carteService.GetActiveCarteByClient(item.idClient, item.numCarte).subscribe(
      (res: any) => {
        this.ActivePPCarte = res[0]
        this.ActivePSCarte = res[1]

        this.TransfertPSModal.show()
      });
  }

  get f() { return this.form.controls };

  get fRecharge() { return this.Rechrgeform.controls; }

  printContact(cmpName: any) {
    var divToPrint = document.getElementById(cmpName);
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
    newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
      // newWin.close();
      this.ListdetailCarte = [];
      this.DetailEnteteCarte = [];
    }, 1000);
    newWin.onafterprint = function () {
    }
  }


  //******************** Fiche de suivi carte pétrolière *********************************
  async downlaod(file) {

    this.selectedFile = file

    //console.log("fileeee", this.selectedFile)

    this.SelectedDate = this.form.get('dateDebut').value;
    this.SelectedDate = this.datePipe.transform(this.SelectedDate, "yyyyMMdd")

    var obj = {
      dateActivation: file.dateActivation,
      dateCreation: file.dateCreation,
      idClient: file.idClient,
      numCarte: file.numCarte,
      raisonSociale: file.raisonSociale,
      typeCarte: file.typeCarte,
      dateValidite: file.dateValidite,
      nomPrenom: file.nomPrenom,
      //dateUserDmdActivation
      //createur
      //validateur
      //userDmdActivation
      //userActivation

    }

    this.SelectedIdClient = obj.idClient;
    this.SelectedNameClient = obj.raisonSociale;
    //console.log("obj act", obj.dateActivation)

    this.carteService.detail(obj.idClient, obj.dateActivation, obj.numCarte).subscribe((resp: any) => {
      let res = resp.result;
      if (res.length == 0) {
        this.toasterService.pop('error', '', 'Rien à imprimer!!! Veuillez activer au moins une carte.');
      } else {
        this.ListdetailCarte = resp.result;
        this.DetailEnteteCarte = resp.entete;
        setTimeout(() => {
          this.printContact("iDdIV28")
        }, 500);
      }
    });
  }


}