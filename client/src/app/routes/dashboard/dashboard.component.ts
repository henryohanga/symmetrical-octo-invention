import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { format } from 'date-fns'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  isEditModalVisible = false;
  isEditLoading = false;
  isNewLoading = false;
  isNewModalVisible = false;
  allmanufacturers: any[]
  currentMeter = {
    "_id": "",
    "created_at": "",
    "updated_at": "",
    "description": "",
    "manufacturer_id": "",
    "serial":"",
  }
  ps = 20;
  total = 200; // mock total
  args: any = { _allow_anonymous: true };
  url = `https://api.randomuser.me/?results=20`;
  smartmeters: any[] = [];
  scroll = { y: '330px' };
  columns: STColumn[] = [
    { title: 'id', index: '_id', type: 'checkbox' },
    {
      title: 'Serial',
      index: 'serial',
      width: 150
    },
    { title: 'ManufactureId', index: 'manufacturer_id' },
    {
      title: 'Description',
      index: 'description',
      width: 120,
    },
    { title: 'Last Updated', index: 'updated_at', type: 'date'},
    {
      title: 'Actions',
      buttons: [
        {
          text: 'Edit',
          click: item => this.showEditModal(item),
        },
        {
          text: 'Delete',
          type: 'del',
          click: item => this.deleteMeter(item._id),
        },
      ],
    },
  ];
  validateForm: FormGroup;
  constructor(
    public http: _HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      serialno: [null, [Validators.required]],
      description: [null, [Validators.required]],
      manufacturer_id: [null]
    });
    this.fetchManufacturers()
    this.fetchMeters()
  }

  fullChange(val: boolean) {
    this.scroll = val ? { y: '350px' } : { y: '230px' };
  }
  showEditModal(item): void {
    this.currentMeter = item
    this.validateForm.controls.serialno.setValue(item.serial)
    this.validateForm.controls.description.setValue(item.description)
    this.validateForm.controls.manufacturer_id.setValue(item.manufacturer_id)
    this.isEditModalVisible = true;
  }
  showNewModal(): void {
    this.currentMeter = {
      "_id": "",
      "created_at": "",
      "updated_at": "",
      "description": "",
      "manufacturer_id": "",
      "serial":"",
    }
    this.validateForm.controls.serialno.setValue("")
    this.validateForm.controls.description.setValue("")
    this.validateForm.controls.manufacturer_id.setValue("")
    this.isNewModalVisible = true;
  }

  handleEditOk(): void {
    this.isEditModalVisible = false;
  }

  handleEditCancel(): void {
    this.isEditModalVisible = false;
  }
  handleNewOk(): void {
    this.isNewModalVisible = false;
  }

  handleNewCancel(): void {
    this.isNewModalVisible = false;
  }

  // Fetch all Smart Meters
  fetchMeters() {
    this.http.get('http://localhost:3001/v1/smart-devices/').subscribe((res: any[]) => {
    // console.log(res)
    this.smartmeters = res
  });
  }

  deleteMeter(id) {
    this.http.post('http://localhost:3001/v1/smart-devices/delete', {"_id": id}).subscribe((res: any[]) => {
    });
    this.message.info(`Meter ${id} Deleted`)
  }
  fetchManufacturers() {
    this.http.get('http://localhost:3001/v1/manufacturers/').subscribe((res: any[]) => {
    console.log(res)
    this.allmanufacturers = res
  });
  }
}
