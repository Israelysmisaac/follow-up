import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Customer {
  id: string;
  name: string;
  contactInfo: string;
  lastVisitDate: Date;
  nextFollowupDate: Date;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly STORAGE_KEY = 'customers';
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  
  constructor() {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    const customersJson = localStorage.getItem(this.STORAGE_KEY);
    if (customersJson) {
      try {
        const customers = JSON.parse(customersJson, (key, value) => {
          // Convert date strings back to Date objects
          if (key === 'lastVisitDate' || key === 'nextFollowupDate') {
            return new Date(value);
          }
          return value;
        });
        this.customersSubject.next(customers);
      } catch (error) {
        console.error('Error parsing customers from localStorage', error);
        this.customersSubject.next([]);
      }
    }
  }

  private saveCustomers(customers: Customer[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers));
    this.customersSubject.next(customers);
  }

  getCustomers(): Observable<Customer[]> {
    return this.customersSubject.asObservable();
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customersSubject.value.find(customer => customer.id === id);
  }

  getTodayFollowups(): Observable<Customer[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const customers = this.customersSubject.value.filter(customer => {
      const followupDate = new Date(customer.nextFollowupDate);
      followupDate.setHours(0, 0, 0, 0);
      return followupDate.getTime() === today.getTime();
    });
    
    return new BehaviorSubject<Customer[]>(customers).asObservable();
  }

  addCustomer(customer: Omit<Customer, 'id'>): void {
    const customers = [...this.customersSubject.value];
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
    };
    
    customers.push(newCustomer);
    this.saveCustomers(customers);
  }

  updateCustomer(customer: Customer): void {
    const customers = this.customersSubject.value.map(c => 
      c.id === customer.id ? customer : c
    );
    this.saveCustomers(customers);
  }

  deleteCustomer(id: string): void {
    const customers = this.customersSubject.value.filter(c => c.id !== id);
    this.saveCustomers(customers);
  }

  setFollowupDate(customerId: string, daysLater: number): void {
    const customers = [...this.customersSubject.value];
    const customerIndex = customers.findIndex(c => c.id === customerId);
    
    if (customerIndex !== -1) {
      const customer = customers[customerIndex];
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysLater);
      
      customers[customerIndex] = {
        ...customer,
        lastVisitDate: new Date(),
        nextFollowupDate: nextDate
      };
      
      this.saveCustomers(customers);
    }
  }
}