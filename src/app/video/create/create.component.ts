import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatChipInputEvent, MatChipList, MatStepper } from '@angular/material';
import { VideoService } from '../video.service';

@Component({
  selector: 'mist-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @ViewChild('chipList') chipList: MatChipList;
  isSubmitting = false;
  cid: string;
  infoForm: FormGroup;
  constructor(private _fb: FormBuilder, private _video: VideoService) { }

  createInfo() {
    this.infoForm = this._fb.group({
      title: ['', [Validators.required]],
      price: [0, [Validators.required]],
      tags: this._fb.array([], [Validators.required]),
      desc: [''],
    });
  }
  ngOnInit() {
    this.createInfo();
  }
  get tagList() {
    return this.infoForm.get('tags') as FormArray;
  }
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tagList.push(this._fb.control(value.trim()));
    }
    if (this.tagList.controls.length > 0) {
      this.chipList.errorState = false;
    } else {
      this.chipList.errorState = true;
    }
    if (input) {
      input.value = '';
    }
  }
  removeTag(index: number): void {
    if (index >= 0) {
      this.tagList.removeAt(index);
    }
    if (this.tagList.controls.length === 0) {
      this.chipList.errorState = true;
    }
  }
  create(stepper: MatStepper) {
    this.isSubmitting = true;
    this._video.createCollection(this.infoForm.value).subscribe(re => {
      this.isSubmitting = false;
      if (re['status']) {
        this.cid = re['cid'];
        stepper.next();
      }
    });
  }
}
