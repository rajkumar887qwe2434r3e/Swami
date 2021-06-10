import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// Search
import { NbSearchService } from '@nebular/theme';

// RxJS
import { takeWhile } from 'rxjs/operators' ;
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';

// Toaster 
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
// import { NbToastStatus } from '@nebular/theme/components/toastr/model';


// Data Service
import { DataGatherInfoService } from '../../@core/data/data-gather-info.service';

// Report
// declare const require: any;
// const jsPDF = require('jspdf');
// import { jsPDF } from 'jspdf';
// import * as jsPDF from 'jspdf';
import jsPDF from 'jspdf'
import 'jspdf-autotable'

declare let canvg: any;
declare let svgAsPngUri: any;
declare let saveSvgAsPng: any;
// import * as html2canvas from "html2canvas";
import html2canvas from 'html2canvas';

@Component({
    selector: 'ngx-gatherer',
    styleUrls: ['./gatherer.component.scss'],
    templateUrl: './gatherer.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})

export class GathererComponent implements OnInit {
    @ViewChild('pageGather', { static: false }) private nbCardContainer: ElementRef;
    public  gathered: any = [];
    public  datas: any;
    public  processing: boolean = false;
    public  searchSubs: any;
    public  svg: any;
    public  img: any;
    public  divInvisible: any;
    public  getCanvas: any;
    public  downloadJsonHref: any;
    public  timeline: any = [];
    public  profile: any = [];
    public  name: any = [];
    public  location: any = [];
    public  gender: any = [];
    public  social: any = [];
    public  photo: any = [];
    public  organization: any = [];

    public  onH: boolean = true;
    public  onS: boolean = true;
    public  onN: boolean = true;

    public  validationShow = {
        hard: true,
        soft: true,
        no: true,
    };

    public  flipped = false;


    constructor(private searchService: NbSearchService, 
                private sanitizer: DomSanitizer,
                private dataGatherService: DataGatherInfoService) {
    }

    ngOnInit() {
        this.searchSubs = this.searchService.onSearchSubmit()
          .subscribe((data: any) => {
            // Initialize global data
            this.gathered = this.dataGatherService.initialize();
            console.log("Global data initialize", this.gathered);

            console.log("Search", data);
            this.gathered = this.dataGatherService.validateEmail(data.term); 
        })

        console.log("GathererComponent ngOnInit")
        // Check global data
        this.gathered = this.dataGatherService.pullGather();
        console.log("GathererComponent ngOnInit", this.gathered)
        console.log("GathererComponent ngOnInit length", this.jsonLength(this.gathered))
    }

    ngOnDestroy () {
        this.searchSubs.unsubscribe();
    }

    generateDownloadJsonUri() {
        let sJson = JSON.stringify(this.gathered);
        let element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
        element.setAttribute('download', "gathered.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
    }

    jsonLength(obj: any) {
        try {
          return Object.keys(obj).length;
        }
        catch(e) {
          return 0;
        }
    }

    setValidation(val: any) {
        this.validationShow[val] = !this.validationShow[val];
        console.log(this.validationShow);
    }

    checkValidation(val: any) {
        return this.validationShow[val]
    }

    toggleFlipViewAndSearch(email, username, twitter, instagram, linkedin, github, tiktok, tinder, venmo, reddit, spotify, twitch) {
        console.log("Advance Search");
        console.log("email", email);
        console.log("username", username);
        console.log("twitter", twitter);
        console.log("instagram", instagram);
        console.log("linkedin", linkedin);
        console.log("github", github);
        console.log("tiktok", tiktok);
        console.log("tinder", tinder);
        console.log("venmo", venmo);
        console.log("reddit", reddit);
        console.log("spotify", spotify);
        console.log("twitch", twitch);

        this.flipped = !this.flipped;

        // JSON datas
        this.datas = {email: email, 
            username: username, 
            twitter: twitter, 
            instagram: instagram,
            linkedin: linkedin,
            github: github,
            tiktok: tiktok,
            tinder: tinder,
            venmo: venmo,
            reddit: reddit,
            spotify: spotify,
            twitch: twitch,
        };
        
        this.gathered = this.dataGatherService.initialize();
        console.log("Global data initialize (Advance Gatherer)", this.gathered);

       
        this.gathered = this.dataGatherService.pullGather();

    }

    toggleFlipView() {
        this.flipped = !this.flipped;
    }

 
}
