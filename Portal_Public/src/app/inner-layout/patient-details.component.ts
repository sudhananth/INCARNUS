import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { first } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SignupDialog, SigninDialog } from '../home/home.component';
import { CancelAppoinmentDialog } from './cancel-appointment-popup';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debug } from 'util';
@Component({
    selector: 'app-patient-detail',
    templateUrl: './patient-details.component.html',
    styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
    patientCard: any;
    patientPhoto: string = '';
    frmPatientInfo: FormGroup;
    genderList: any[] = [];
    titleList: any[] = [];
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {            
            this.doGetPatient(params.get("id"))
        })
    }
    constructor(
        private _doctorService: DoctorService, public dialog: MatDialog, private route: ActivatedRoute, private _fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {

    }
    getTitleList() {
        this._doctorService.getTitleList().subscribe(
          s => { this.titleList = s.dropdownlist; }
        );
      }
    getGenderList() {
        this._doctorService.getGenderList().subscribe(
            s => { this.genderList = s.dropdownlist; }
        );
    }
    formInialize(PatienData: any) {

        this.frmPatientInfo = this._fb.group({
            Title:[PatienData.titleuid._id, Validators.required],
            FirstName: [PatienData.firstname, Validators.required],
            LastName: [PatienData.lastname, Validators.required],
            MiddleName: [PatienData.middlename],
            DOB: [PatienData.dateofbirth, Validators.required],
            WorkPhone: [PatienData.contact.workphone, Validators.required],
            MobileNo: [PatienData.contact.mobilephone, Validators.required],
            EmailId: [PatienData.contact.emailid, Validators.required],
            Gender: [PatienData.genderuid._id, Validators.required],
            Address: [PatienData.address.address, Validators.required],
            Area: [PatienData.address.area, Validators.required],
            City: [PatienData.address.city, Validators.required],
            State: [PatienData.address.state, Validators.required],
            Country: [PatienData.address.country, Validators.required],
            ZipCode: [PatienData.address.zipcode, Validators.required]
        });
    }

    doGetPatient(id) {
        this.getGenderList();
        this.getTitleList();
        this._doctorService.getpatientcarddetail(id).subscribe(
            s => {
                this.patientCard = s.patient;
                this.formInialize(this.patientCard);
                this._doctorService.getpatientphoto(id).subscribe(
                    s => {
                        this.patientPhoto = '';
                        if (s.patientimage && s.patientimage.length > 0) {
                            this.patientPhoto = s.patientimage[0].patientphoto;
                        }
                    }
                );
            }
        );
    }
    Save() {
        if (this.frmPatientInfo.valid) {
            let values = this.frmPatientInfo.value;
            this._doctorService.createPatient(values.FirstName,values.LastName,values.MiddleName,values.Gender,values.Title,values.DOB,values.WorkPhone,values.EmailId).subscribe(
                s => {
                    this.snackBar.open("Patient Information Updated Successfully.", "", {
                        duration: 2000,
                      });
            
                }, e => { }
            );
            console.log(this.frmPatientInfo);
        }
    }
}