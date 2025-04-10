import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService, Customer } from '../services/customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: string | null = null;
  minFollowupDate: string;
  today: string;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Get today's date and format it for the date input
    const todayDate = new Date();
    this.today = this.formatDateForInput(todayDate);
    
    // Set minimum follow-up date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minFollowupDate = this.formatDateForInput(tomorrow);
    
    // Default next follow-up date is 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      contactInfo: ['', Validators.required],
      lastVisitDate: [this.today, Validators.required],
      nextFollowupDate: [this.formatDateForInput(nextWeek), [Validators.required, this.followupDateValidator()]],
      notes: ['']
    });
  }

  // Format date for input field (YYYY-MM-DD)
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  // Custom validator to ensure follow-up date is not today
  followupDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const followupDate = new Date(control.value);
      const today = new Date();
      
      // Reset hours, minutes, seconds, and milliseconds for proper date comparison
      followupDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      if (followupDate.getTime() === today.getTime()) {
        return { followupDateIsToday: true };
      }
      
      return null;
    };
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.customerId;
    
    if (this.isEditMode && this.customerId) {
      const customer = this.customerService.getCustomerById(this.customerId);
      if (customer) {
        this.customerForm.patchValue({
          name: customer.name,
          contactInfo: customer.contactInfo,
          lastVisitDate: this.formatDateForInput(new Date(customer.lastVisitDate)),
          nextFollowupDate: this.formatDateForInput(new Date(customer.nextFollowupDate)),
          notes: customer.notes
        });
      }
    }
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const formValues = this.customerForm.value;
    
    if (this.isEditMode && this.customerId) {
      this.customerService.updateCustomer({
        id: this.customerId,
        ...formValues,
        lastVisitDate: new Date(formValues.lastVisitDate),
        nextFollowupDate: new Date(formValues.nextFollowupDate)
      });
    } else {
      this.customerService.addCustomer({
        ...formValues,
        lastVisitDate: new Date(formValues.lastVisitDate),
        nextFollowupDate: new Date(formValues.nextFollowupDate)
      });
    }
    
    this.router.navigate(['/customers']);
  }

  setFollowupDate(days: number): void {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);
    
    // Format date for input field
    const formattedDate = this.formatDateForInput(nextDate);
    this.customerForm.patchValue({ nextFollowupDate: formattedDate });
  }
}