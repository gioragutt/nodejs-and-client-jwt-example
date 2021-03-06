import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent {
  @Input() placeholder = '';
  @Input() icon = '';
  @Output() submitText = new EventEmitter<string>();

  text = '';

  onFormSubmit(): void {
    const submittedText = this.text && this.text.trim();
    if (submittedText.length > 0) {
      this.submitText.emit(submittedText);
      this.text = '';
    }
  }
}
