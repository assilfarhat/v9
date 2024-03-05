import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {

  files: any = [];
  @Output() newItemEvent = new EventEmitter<string>();
  @Output() deleteItemEvent = new EventEmitter<string>();

  addNewItem(value: string) {
    this.newItemEvent.emit(value);
  }

  constructor() { }

  ngOnInit() {}

  uploadFile(event) {
    this.files = []
    // console.log(event)
    const element = event[0];
    this.addNewItem(element)
    this.files.push(element.name)

    // for (let index = 0; index < event.length; index++) {
    //   const element = event[index];
    //   this.addNewItem(element)
    //   this.files.push(element.name)
    // }  
  }

  deleteAttachment(index) {
    this.files.splice(index, 1);
    this.deleteItemEvent.emit(index);
  }
}
