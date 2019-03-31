import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../services/doctor.service';
// import { DoctorService } from '../../services/doctor.service';
import { Router } from '@angular/router';
export interface DialogData {
  animal: string;
  name: string;
}
export interface Animal {
  name: string;
  sound: string;
}
export interface Doctorinformation {
  value: string;
  speciality: string;
}
export interface DialogData {
  patientin: string;
  patientout: string;
}
export interface PeriodicElement {
  date: string;
  position: number;
  morningtime: string;
  eveningtime: string;
  place: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, date: 'SUN, 20 JAN 2019', morningtime: " 09:00-12:00 ", eveningtime: '13:30-18:00', place: "VIKARAMPURI - HYDERABAD" },
  { position: 2, date: 'MON, 21 JAN 2019', morningtime: " 09:00-12:00 ", eveningtime: '13:30-18:00', place: "VIKARAMPURI - HYDERABAD" },
  { position: 3, date: 'SUN, 20 JAN 2019', morningtime: " 09:00-12:00 ", eveningtime: '13:30-18:00', place: "VIKARAMPURI - HYDERABAD" },
  { position: 4, date: 'MON, 21 JAN 2019', morningtime: " 09:00-12:00 ", eveningtime: '13:30-18:00', place: "VIKARAMPURI - HYDERABAD" },
  { position: 5, date: 'SUN, 20 JAN 2019', morningtime: " 09:00-12:00 ", eveningtime: '13:30-18:00', place: "VIKARAMPURI - HYDERABAD" },
  { position: 6, date: 'SUN, 20 JAN 2019', morningtime: " 09:00-12:00 ", eveningtime: '13:30-18:00', place: "VIKARAMPURI - HYDERABAD" },
];
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['position', 'date', 'morningtime'];
  dataSource = ELEMENT_DATA;
  doctorprofiehidden: any;
  doctorForm: FormGroup;
  public email: number;
  animal: string;
  name: string;
  patientin: string;
  patientout: string;
  public doctors = [];
  public data: any;
  public searchres: any;
  doctorpro: any;
  doctorname: string;
  selectedDevice: any;
  prourl: any;
  public underlinbg = 'download.png';
  public doctorinfo_banner = ' doctorinfo.jpg';
  public pro = 'doctor_img.jpg';
  public logo = 'logo.png';
  public location_img = 'g3.jpg';
  public doctordetailshidden = true;
  public timetablehidden = true;
  availabletimehidden = true;
  doctorprodetails = true;
  tabprofiledetails = true;
  appointmentSessionList: appointmentsessions[] = [];
  appointmentSlots: any;
  selectedscheduleID: string = ""; //"5c831b3c48929107b469de16";
  selectedSessionId: string = '';
  selectedSlotId: string = '';
  selectedDoctorId: string = '';
  selectedSlotInfo: any;

  constructor(public dialog: MatDialog,
    private _doctorService: DoctorService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,

  ) { }
  locationsControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  locations: Animal[] = [
    { name: 'Selam', sound: 'Selam' },
    { name: 'Chennail', sound: 'Chennail!' },
    { name: 'Coimbatore', sound: 'Coimbatore' },
    { name: 'Tiruvannamalai', sound: 'Tiruvannamalai' },
  ];
  selectedValue: string;
  doctorinformation: Doctorinformation[] = [
    { value: 'Fertility', speciality: 'Fertility' },
    { value: 'Childcare', speciality: 'Childcare' },
    { value: 'WomenHealth', speciality: 'Women Health' },
  ];
  // doctorlocation : Doctorlocation [] = [
  //   { value : 'ChildCare', name: 'Chennai'},
  //   { value : 'WomenHealth', name : 'Coimbatore'},
  //   { value : 'FertilityCare', name: 'Salem'},
  // ];

  // selectedloaction:string;
  doctortimetable(val) {
    console.log(val);
    if (val == 'Childcare') {
      this.timetablehidden = false;
    }
    if (val == 'WomenHealth') {
      this.timetablehidden = false;
    }
    if (val == 'Fertility') {
      this.timetablehidden = false;
    }
  }


  specialtylist: any[] = [];
  locationlist: any[] = [];
  doctorsList: any[] = [];
  selecteddoctor: any = null;
  ngOnInit() {
    this.formInitialize();
    this.getspecialtylist();
    this.getLocationlist();

    // this.doctorsearchlist();
    // //  this._doctorService.getDoctor();
    // localStorage.setItem('doctorlocation', this.data.location);
    // this.doctorprofiehidden = 0;
    // this.doctorpro = true;
    // this._doctorService.getDoctor()
    //   .pipe(first())
    //   .subscribe(data => {
    //     this.data = data;
    //     console.log(this.data);
    //     this.doctorsearchlist();
    //   },
    //     error => {
    //       console.log(error);
    //     });
  }

  openDialog(obj): void {
    this.selectedSlotInfo = obj;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: { selectedscheduleID: this.selectedscheduleID, selectedSlotInfo: this.selectedSlotInfo }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.patientout = result;
    });
  }

  formInitialize() {
    this.doctorForm = this.formBuilder.group({
      speciality: [''],
      location: [''],
      name: ['']
      // name: [this.data.name, Validators.required]
    });
  }

  getspecialtylist() {
    this._doctorService.getspecialtylist().subscribe(
      s => { this.specialtylist = s.dropdownlist; }
    );
  }

  getLocationlist() {
    this._doctorService.getLocationList().subscribe(
      s => { this.locationlist = s.dropdownlist; }
    );
  }

  appointmentSessionDetails(obj) {
    this._doctorService.getdoctorphoto(obj._id).subscribe(s => {
      debugger;
      this.docimg = '';
      if (s.doctorimage && s.doctorimage.length > 0)
        this.docimg = s.doctorimage[0].doctorphoto;
     
    });
    debugger;
    // this.router.navigateByUrl('/doctorsdetais');
    this.timetablehidden = false;
    // this.tabprofiledetails = false;
    this.doctorprodetails = false;
    this.doctordetailshidden = true;
    this.selecteddoctor = obj;

    this._doctorService.getappointmentsession(obj._id).subscribe(s => {
      this.selectedDoctorId = obj._id;
      console.log(s);

      let appointment: any[] = s.appointmentsessions;

      let morningtime: any[] = [];

      appointment.forEach(element => {

        element.slotdetails.forEach(slot => {
          let loc = slot.location;
          let i = 1;
          slot.timings.forEach(time => {
            if (new Date(time.starttime)) {
              let sesstionstarttime = new Date(time.starttime);
              let sesstionendtime = new Date(time.endtime);
              let starttime = sesstionstarttime.getHours();
              let slots = {
                slotIndex: i,
                slotId: slot._id,
                slotName: loc + ' <br/>' + ((starttime < 10 ? "0" + starttime : starttime) + ':' + (sesstionstarttime.getMinutes() < 10 ? "0" + sesstionstarttime.getMinutes() : sesstionstarttime.getMinutes())) + '-' + ((sesstionendtime.getHours() < 10 ? "0" + sesstionendtime.getHours() : sesstionendtime.getHours()) + ":" + (sesstionendtime.getMinutes() < 10 ? "0" + sesstionendtime.getMinutes() : sesstionendtime.getMinutes())),
                starttime: time.starttime,
                endtime: time.endtime,
                duration: time.duration,
                maxappointments: time.maxappointments,
                noofslots: time.noofslots,
                sessionId: element._id
              };
              morningtime.push(slots);
              i++;
            }

          });
        });

      });

      let currentDate = new Date();
      let appointmentsessions: appointmentsessions[] = [];




      for (let index = 0; index < 8; index++) {
        let date = new Date(currentDate.setDate(new Date().getDate() + index))

        let session: appointmentsessions = {
          date: date,
          position: (index + 1),
          morningtime: morningtime,

        }
        appointmentsessions.push(session);
      }
      this.appointmentSessionList = appointmentsessions;
      console.log(appointmentsessions);
    });
  }

  filesToUpload: any[] = [];
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
  docimg: string = "";
  upload() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    console.log(files);

    for (let i = 0; i < files.length; i++) {
      formData.append("uploads[]", files[i], files[i]['name']);
    }
    console.log('form data variable :   ' + formData.toString());
    this._doctorService.savephoto(formData).subscribe(
      s => { },
      e => { }
    );
    // this.http.post('http://localhost:3003/upload', formData)
    //     .map(files => files.json())
    //     .subscribe(files => console.log('files', files))
  }

  availabletime(slots: any, AppointmentDate: Date) {
    debugger;
    this.selectedSlotId = slots.slotId;
    this.selectedSessionId = slots.sessionId;
    this.availabletimehidden = false;
    this.timetablehidden = true;
    this.doctorprodetails = false;

    let maxappointments: number = slots.maxappointments ? slots.maxappointments : 100;
    let startTime = new Date(slots.starttime);

    startTime = new Date(AppointmentDate.toDateString() + " " + startTime.getHours() + ":" + startTime.getMinutes() + ":00");


    let slot: any[] = [];
    let ed = new Date(slots.endtime);
    let enddate = new Date(AppointmentDate.toDateString() + " " + ed.getHours() + ":" + ed.getMinutes() + ":00");;
    for (let m = 0; m < maxappointments; m++) {
      let st = new Date(startTime);
      startTime.setMinutes(startTime.getMinutes() + slots.duration);
      let date = new Date(startTime);
      if (enddate < date)
        break;
      slot.push({ startTime: st, endTime: date, slotNo: (m + 1) });
    }
    this.appointmentSlots = { appointmentDate: AppointmentDate, slots: slot };
    // to get appointment schedule
    this._doctorService.getappointmentschedule(this.selectedSessionId, AppointmentDate.toDateString()).subscribe(s => {
      if (s.appointments.length > 0) {
        this.selectedscheduleID = s.appointments[0]._id; // Scheduleid
      }
      else {
        let obj = { '_id': this.selectedSlotId };

        this._doctorService.createSchedule(this.selectedSessionId, AppointmentDate, [obj]).subscribe(s => {
          s => {
            this.selectedscheduleID = s.uid;
          }
        });
      }
      console.log(s);
    });
    console.log(slot);
  }

  doctorprofile() {
    // this.router.navigateByUrl('/doctorsprofile');
    this.tabprofiledetails = false;
    // this.timetablehidden = false;
    this.doctordetailshidden = true;
  }

  selectedloaction: string;
  searchclick() {

    let formData = this.doctorForm.value;

    this._doctorService.doctorsearch(formData.name, formData.location, formData.speciality).subscribe(s => {
      this.doctorsList = s.doctors;
      console.log(s);
    });

    // const doctorsearch = JSON.parse(localStorage.getItem('doctorlocation'));
    // console.log(this.doctorForm.value.location);
    // if (this.doctorForm.value.location === doctorsearch) {
    //   this.doctordetailshidden = false;
    // }
    // // this._doctorService.update_doctor(this.doctorForm.value.location)

    // //     .pipe(first())
    // //     .subscribe(
    // //         (res: Response) => {
    // //         console.log(res);
    // //           this.searchres = res ;
    // //         },
    // //         error => {
    // //             alert(error);
    // //         });

  }
  signin(): void {
    const dialogRef = this.dialog.open(SigninDialog, {
      width: '400px',
      panelClass: 'sign-dialog-container',
      data: { name: this.name, animal: this.animal }
    });
    dialogRef.afterClosed().subscribe(result => {


    });
  }
  signup(): void {
    const dialogRef = this.dialog.open(SignupDialog, {
      width: '400px',
      panelClass: 'sign-dialog-container',
      data: { name: this.name, animal: this.animal }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}

@Component({
  selector: 'app-signin',
  templateUrl: 'signin.html',
})
export class SigninDialog {
  mobileNo = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  detail: Object;
  login() {

    if (this.mobileNo.valid && this.password.valid) {
      this._doctorService.authenticate(this.mobileNo.value, this.password.value).subscribe(
        s => {
          localStorage.setItem("userId", s.useruid);

          this.dialogRef.close({ type: 1, patientid: s.useruid, userid: this.mobileNo.value });

          //this.router.navigateByUrl('/innerlayout');
        },
        e => {

        }
      );
    }


    // this.router.navigateByUrl('/innerlayout');

  }
  getErrorMessage() {
    debugger;
    return this.mobileNo.hasError('required') ? 'Please enter Mobile No' :
      this.password.hasError('required') ? 'Please enter Password ' : '';

  }
  constructor(
    public dialogRef: MatDialogRef<SigninDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router, private _doctorService: DoctorService,
    private http: HttpClient
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.html',
})
export class SignupDialog {
  verificationCode: string = '';
  email = new FormControl('', [Validators.email]);
  fname = new FormControl('', [Validators.required]);
  lname = new FormControl('', [Validators.required]);
  mname = new FormControl('');
  title = new FormControl('', [Validators.required]);
  gender = new FormControl('', [Validators.required]);
  phone = new FormControl('', [Validators.required]);
  dob = new FormControl('', [Validators.required]);
  verifyCode = new FormControl('', [Validators.required]);
  comment = new FormControl('');
  titleList: any[] = [];
  genderList: any[] = [];
  isVerifyCode: boolean = false;
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }
  constructor(
    public dialogRef: MatDialogRef<SignupDialog>, private _doctorService: DoctorService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.getTitleList();
    this.getGenderList();
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
  onNoClick(): void {
    this.dialogRef.close();
  }
  Verify() {
    this._doctorService.getverificationcode().subscribe(s => {
      debugger;
      this.verificationCode = s.code;
      console.log(s.code);
      let name = (this.fname.value + ' ' + this.lname.value);
      this._doctorService.verifysms(this.phone.value, s.code, name).subscribe(
        s => {

        }
      );
      this.isVerifyCode = true;
    });
  }
  Submit() {
    debugger;
    if (this.verificationCode == this.verifyCode.value) {
      this._doctorService.createPatient(this.fname.value, this.lname.value, this.mname.value, this.gender.value, this.title.value, this.dob.value, this.phone.value, this.email.value).subscribe(s => {
        let name = "password12";
        //let name = this.fname.value + '' + this.lname.value;
        //if (name.length > 4) {
        //  name = name.substring(0, 3);
        //}
        //name = name + new Date(this.dob.value).getFullYear();
        debugger;
        this._doctorService.ChangePassword(this.phone.value, name).subscribe(
          s1 => { }
        );
        this.dialogRef.close({ type: 2, patientid: s.patient.uid });
      });
    }
    else {
      alert("Incorrect Verification Code. Please enter the code received in sms.");
    }
  }
}

@Component({
  selector: 'app-availabletime2',
  templateUrl: 'availabletimepopup.html',
})
export class DialogOverviewExampleDialog {
  animal: string;
  name: string;
  constructor(private _doctorService: DoctorService, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  signin(): void {
    const dialogRef = this.dialog.open(SigninDialog, {
      width: '400px',
      panelClass: 'sign-dialog-container',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result.type == 1) {
        //  let start = this.data.selectedSlotInfo.startTime.toDateString() + "T" + this.data.selectedSlotInfo.startTime.getHours()+":"+this.data.selectedSlotInfo.startTime.getMinutes+":00";
        //  let end = this.data.selectedSlotInfo.endTime.toDateString() + "T" + this.data.selectedSlotInfo.endTime.getHours()+":"+this.data.selectedSlotInfo.endTime.getMinutes+":00";
        this._doctorService.addbooking(this.data.selectedscheduleID, this.data.selectedSlotInfo.startTime, this.data.selectedSlotInfo.endTime, result.patientid, this.data.selectedSlotInfo.slotNo).subscribe(s => {


          this.snackBar.open("Appointment is registered successfully. We will message you on the confirmation of appointment.", "", {
            duration: 2000,
          });



          // alert("Appointment is registered successfully. We will message you on the confirmation of appointment.");
        }, e => { });
      }


    });
  }

  signup(): void {
    const dialogRef = this.dialog.open(SignupDialog, {
      width: '400px',
      panelClass: 'sign-dialog-container',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.type == 2) {
        this._doctorService.addbooking(this.data.selectedscheduleID, this.data.selectedSlotInfo.startTime, this.data.selectedSlotInfo.endTime, result.patientid, this.data.selectedSlotInfo.slotNo).subscribe(s => {
          alert("Appointment is registered successfully. We will message you on the confirmation of appointment.");
        }, e => { });
      }
    });
  }

}


export class appointmentsessions {
  position: number;
  date: Date;
  morningtime: any[];
}