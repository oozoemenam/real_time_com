import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements AfterViewInit {
  @ViewChild('video') video!: ElementRef;
  @Input() videoStream!: MediaStream;

  ngAfterViewInit(): void {
    this.video.nativeElement.srcObject = this.videoStream;
  }
}
