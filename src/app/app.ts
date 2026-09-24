import { Component, signal } from '@angular/core';
import { GalEditorComponent } from './gal-editor/gal-editor';


@Component({
  selector: 'app-root',
  imports: [GalEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'gal-editor';
}
