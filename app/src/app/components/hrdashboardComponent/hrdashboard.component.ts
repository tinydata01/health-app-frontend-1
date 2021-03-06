/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from "@angular/core";
import { NBaseComponent } from "../../../../../app/baseClasses/nBase.component";
import { NLocalStorageService } from 'neutrinos-seed-services';
import { FormControl } from "@angular/forms";
/*
Client Service import Example:
import { servicename } from 'app/sd-services/servicename';
*/
//importing the logout service 
import { logoutService } from 'app/services/logout/logout.service';

import { saveuserresponse } from "app/sd-services/saveuserresponse";
import { hrdashboard } from "app/sd-services/hrdashboard";
/*
Legacy Service import Example :
import { HeroService } from '../../services/hero/hero.service';
*/
//declaring the cordova variable
declare var cordova: any;


@Component({
  selector: "bh-hrdashboard",
  templateUrl: "./hrdashboard.template.html",
})
export class hrdashboardComponent extends NBaseComponent implements OnInit {
  dashboard: any;
  name = "Angular";
  locationname: any;
  q1postive: number;
  q1negative: number;
  q2postive: number;
  q2negative: number;
  q3postive: number;
  q3negative: number;
  location: any[];
  fromDate: any ;
  toDate: any ;
  newarr = [];
  updatelocations: any;
  totallocations: any;
  locationName: any;
  date: any;
  myControl: FormControl;
  jwtToken:string;
  isLoading:boolean = false;

  constructor(
    private hrdashboard: hrdashboard,
    private getlocation: saveuserresponse,
    private nLocalStorage: NLocalStorageService,
    private logoutService: logoutService

  ) {
    super();
    this.localeService.language = "en";
    this.getToken();
    this.setFromAndToDate();
  }

  setFromAndToDate(){
    this.fromDate = new Date()
    this.toDate = new Date()
  }


  getToken(){
    this.jwtToken = this.nLocalStorage.getValue('jwtToken');
  }

  async getDashboardData(){
    let fromDate = null
    let toDate = null
    if(this.fromDate){
      fromDate = new Date(this.fromDate.toDateString() + ' 00:00:00').toISOString()
    }
    if(this.toDate){
      toDate = new Date(this.toDate.toDateString() + ' 23:59:59').toISOString()
    }

    try{
      let filter = {
        fromDate: fromDate, 
        toDate: toDate,
        locationName: this.locationName || null // for any falsy value send null
      }
      this.isLoading = true;
      let bh = await this.hrdashboard.hrDashboard(filter, this.jwtToken)
      if(bh && bh.local && bh.local.result){
        this.q1postive = bh.local.result.q1Positive
        this.q1negative = bh.local.result.q1Negative
        this.q2postive = bh.local.result.q2Positive
        this.q2negative = bh.local.result.q2Negative
        this.q3postive = bh.local.result.q3Positive
        this.q3negative = bh.local.result.q3Negative
      }
      this.isLoading = false;
    } catch(err){
      console.error(err)
      this.isLoading = false;
    }
  }

  async getLocations(){
    try {
      let locale = this.nLocalStorage.getValue("language") || 'en';
      let bh = await this.getlocation.getLocations(locale, this.jwtToken);
      this.locationname = bh.local.result;
      this.location = this.newarr;
      this.updatelocations = bh.local.result;
      this.totallocations = this.updatelocations;
    } catch(err){
      console.error(err)
    }
  }

  async ngOnInit() {
    await this.getLocations()
    await this.getDashboardData()
  }

  locationFilter() {
    this.updatelocations = this.filter(this.totallocations);
  }

  filter(values) {
    return values.filter((location) =>
      location.locationName.toLowerCase().includes(this.locationName.toLowerCase())
    );
  }


  // callback function for location autocomplete optionSelected
  async selected(data) {
    this.locationName = data.option.value
    this.getDashboardData();
  }
   async clearValue(){
     this.locationName='';
     this.updatelocations = this.locationname;
     this.totallocations = this.updatelocations;

   }

  // dateInput callback for fromDate and toDate
   dateselected() {
     this.getDashboardData();
  }
//displaying the logout button
displayLogOut(){
    if (window["cordova"]) {
      return false;
    }else{
        return true;
    }

}

//logout functionality
logout(){
this.logoutService.logout();
}


}
