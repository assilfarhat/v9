import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ReclamationService } from 'app/services/reclamation.service';
import { TokenService } from 'app/services/token.service';


@Component({
  selector: 'app-reclamation-add',
  templateUrl: './reclamation-add.component.html',
  styleUrls: ['./reclamation-add.component.scss']
})

export class ReclamationAddComponent implements OnInit {
  form: any;
  submitted: boolean;
  lang:any;
  isImageValid: boolean = false;
  hasError = false;
  errorMessage: any;
  imagePreview: string | ArrayBuffer;
  fileData: File = null;
  user : any;
  constructor( private fb: FormBuilder,private tokenService : TokenService,private router: Router,
    private toasterService: ToasterService,private reclamationService : ReclamationService) { }

  ngOnInit() {
    this.lang=this.tokenService.getLang();
    // console.log(this.user)
    this.form = this.fb.group({
      "objet": "",
      "message": "",
      "imagePJ":[""]
     })
  }


  checkAndSave(){
    
    this.submitted = true;
    
   
    if (this.form.valid) {

      this.form.imagePJ = this.imagePreview;
      ////console.log("this.form.imagePJ", this.form.imagePJ )
      
      this.reclamationService.addReclamation({
        "RoleUser":this.tokenService.getRole(),
        "objet": this.form.get('objet').value,
        "message": this.form.get('message').value,
        "imagePJ" :this.form.imagePJ

      }).subscribe((resp:any)=>{
      
     
        //this.router.navigate(['/reclamations'])
        if(this.lang=='en'){
          this.toasterService.pop('success', '', 'The complaint has been successfully created')
        }
        else{
          this.toasterService.pop('success', '', 'La reclamation a été créée avec succès')
          this.router.navigate(['/reclamations'])
        }
      },
      (err)=>{
      //  console.log("err",err)
        this.hasError = true;
        this.errorMessage = "Le format du fichier est invalide !";
        this.toasterService.pop('error', '', this.errorMessage)
        
      }
      )
    
  }
}


   // Define the openFileInput method
   openFileInput() {
    // Get a reference to the hidden file input element
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    // Trigger a click event on the file input to open the file dialog
    if (fileInput) {
      fileInput.click();
    }
  }

  fileProgress(fileInput: any) {

    this.fileData = <File>fileInput.target.files[0];

}


fileChange(event: any) {
  //console.log("event", event);
  const file = event.target.files[0];

  if (file) {
    const fileType = file.type;

    // Vérification du type de fichier
    if (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png') {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imagePreview = reader.result;
        this.isImageValid = true;
        //console.log("this.imagePreview", this.imagePreview);
      };
    } else {
      this.isImageValid = false;
      this.imagePreview = null;
      console.error('Type de fichier non accepté');
      this.toasterService.pop('error', '', "Le format de fichier n'est pas autorisé. Veuillez insérer un fichier aux formats JPEG, JPG ou PNG");
    
    }
  }
}

get f() { return this.form.controls };

  

}
