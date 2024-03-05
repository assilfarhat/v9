import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { TokenService } from 'app/services/token.service';
import { ToasterService } from 'angular2-toaster';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {


  @ViewChild('deleteModal') deleteModal;
  @ViewChild('activateModal') activateModal;
  @ViewChild('desactivateModal') desactivateModal;
  @ViewChild('updateModal') updateModal;
   users:any;

    idClient :any;
   dtOptions: any = {};
   dtTrigger = new Subject();
  orgUser:any;
  submitted = true;
  selectedUser;
  form: FormGroup;
  filterQuery = '';
  lang:any;
  constructor(private translateService: TranslateService,private router: Router,
    private userService : UserService,private tokenService : TokenService, private toasterService: ToasterService,private fb: FormBuilder) {

     }

  ngOnInit() {
    this.lang=this.tokenService.getLang();
    if (this.lang=='fr'){
    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',


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
        extend:'print',
        title:'liste des utilisateurs '
      },

      {
        extend:'excel',
        title:'liste des utilisateurs '
      }

    ]
    };
  }

  if (this.lang=='en'){
    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',


      language: {
        processing: "Processing...",
        search: "Search:",
        lengthMenu: "Show _MENU_ entries",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        infoEmpty: "Showing 0 to 0 of 0 entries",
        infoFiltered: "(filtered from _MAX_ total entries)",
        infoPostFix: "",
        loadingRecords: "Loading...",
        zeroRecords: "No matching records found",
        emptyTable: "Aucune donn&eacute;e disponible dans le tableau",
        paginate: {
          first:      "First",
          last:       "Last",
          next:       "Next",
          previous:   "Previous"
        },
        aria: {
            sortAscending: ": activate to sort column ascending",
            sortDescending: ": activate to sort column descending"
        }
     },
     buttons: [
      'copy',
      'print',
      {
        extend:'excel',
        title:'list of users '
      }

    ]
    };
  }

    this.orgUser=this.tokenService.getOrgnaisation();

    if(this.orgUser.length>0){

      this.userService.getAllUsers(this.orgUser[0].id , this.idClient).subscribe(
        (resp:any)=>{
         this.users=resp;
         this.dtTrigger.next();
        }
      )

    }


    }

    selectUser(id : any) {
      this.selectedUser = this.users.find( u => u.id == id);
      this.form = this.fb.group({
        lastName : [ this.selectedUser.lastName, [ Validators.required ]],
        firstName : [ this.selectedUser.firstName, [ Validators.required ]] ,

        userName : [ this.selectedUser.userName, [ Validators.required, Validators.minLength(6)]],

        phoneNumber : [ this.selectedUser.phoneNumber, [ Validators.required, Validators.pattern('[1-9][0-9]{7}') ]],
      })
    }


    ActivateUser(Action) {

      this.userService.activateUser(this.selectedUser.id).subscribe(
        (resp : any)=>{

        this.activateModal.hide();
        this.desactivateModal.hide();
          this.userService.getAllUsers(this.orgUser[0].id).subscribe(
          (resp:any)=>{
           this.users=resp;
           this.toasterService.pop('success', '', "L'utilisateur est  "+ Action + " avec succès")

          },
          (err)=>{
            this.toasterService.pop('error', '', 'Une erreur est survenue')


          }
        );
        }


      );}

  delete(){
    this.userService.deleteUser(this.selectedUser.id).subscribe(
      ()=>{

        this.users =this.users.filter(e=>(e.id != this.selectedUser.id))
        this.toasterService.pop('success', '', 'Utilisateur est supprimé avec succès')

        // if(this.lang=='fr'){
        //   else{
        //     this.toasterService.pop('success', '', 'User deleted')
        //   }

        this.deleteModal.hide();
                   },
        (err) => {

          this.deleteModal.hide();
          this.toasterService.pop('error', '', 'Une erreur est survenue')        }

    )

  }
  updateUser() {
    this.submitted = true;
    this.updateModal.hide();
    if (this.form.valid) {
      let form = this.form.value;
      this.userService.update(this.selectedUser.id, form).subscribe(
        (resp: any) => {
          
          this.updateModal.hide();
          this.users.find(c => c.id == this.selectedUser.id).lastName = form.lastName;
          this.users.find(c => c.id == this.selectedUser.id).firstName = form.firstName;
          this.users.find(c => c.id == this.selectedUser.id).phoneNumber = form.phoneNumber;
          this.users.find(c => c.id == this.selectedUser.id).userName = form.userName;

          //console.log('consolelogin', this.users.find(c => c.id == this.selectedUser.id).userName = form.userName )

          if (this.lang == 'fr') {
            this.toasterService.pop('success', '', 'l\'utilisateur a été modifié avec succès');
          }
          else {
            this.toasterService.pop('success', '', 'User has been successfully modified');
          }

        },
        (err) => {

          if (this.lang == 'fr') {

            this.toasterService.pop('error', '', 'Le nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.');

          }
          else {
            this.toasterService.pop('error', '', 'The username is already taken. Please choose another one.')
          }
        }
      );
    }
    else {
      //console.log("kfjdkjfkdjkjk",this.form)
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
