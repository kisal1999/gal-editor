import { Component, ViewEncapsulation, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getCountries, getCountryCallingCode, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

interface PhoneField {
  iso2: string;
  code: string;
  number: string;
}

interface Country {
  name: string;
  iso2: string;
  dial: string;
}

@Component({
  selector: 'app-gal-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gal-editor.html',
  styleUrl: './gal-editor.css',
  encapsulation: ViewEncapsulation.None
})
export class GalEditorComponent {

  offices = [
    'CAK / AIRBUS STORES - NEW HANGAR',
    'CAK / AIRLINE CENTRE - 1ST FLOOR',
    'CAK / AIRLINE CENTRE - 1ST FLOOR/CAR',
    'CAK / AIRLINE CENTRE - GROUND FLOOR',
    'CAK / ENGINEERING',
    'CAK / ENGINEERING MATERIALS BLDG',
    'CAK / ENGINEERING NEW HANGER',
    'CAK / ENGINEERING OLD HANGER',
    'CAK / EXPORT/IMPORT TERMINAL',
    'CAK / FLIGHT OPERATIONS - MAIN BUILD',
    'CAK / FLIGHT OPERATIONS - NEW WING B',
    'CAK / GSE STORES',
    'CAK / IAA/THE CAFE BUILDING',
    'CAK / MEDICAL CENTRE BUILDING',
    'CAK / OLD CARGO VILLEGE BULK STORES',
    'CAK / OLD ENGINEERING ADMIN BUILDING',
    'CAK / OLD HANGER',
    'CAK / OLD HANGER AIS STORES',
    'CAK / OPERATIONS BUILDING',
    'CAK / RAMP BUILDING',
    'CAK / SECURITY ADMIN BUILDING',
    'CAK / TECHNICAL TRAINING SCHOOL',
    'CAK / TERMINAL BUILDING',
    'CAK / UTILITY - LINE',
    'CAK / WTC - 3RD FLOOR /AIRLINE CENTR',

    'CMB / BOC BLDG - COLOMBO 1',
    'CMB / DE VOS AVENUE',
    'CMB / ORION CITY',
    'CMB / ORION CITY/AIRLINE CENTRE',
    'CMB / REGIONAL BUILDING',
    'CMB / WTC - 21ST FLOOR',
    'CMB / WTC - 22ND FLOOR',
    'CMB / WTC - 3RD FLOOR',
    'CMB / HRI - TERMINAL BUILDING',

    'GLE / GALLE TICKET OFFICE',
    'KND / KANDY TICKET OFFICE',
    'HRI / TERMINAL BUILDING',

    'AUSTRALIA / MEL / MELBOURNE',
    'AUSTRALIA / SYD / SYD',

    'CHINA / BJS / TOWN OFFICE',
    'CHINA / BJS / AIRPORT OFFICE',
    'CHINA / CAN / TOWN OFFICE',
    'CHINA / CAN / AIRPORT OFFICE',
    'CHINA / CAN / CARGO OFFICE',
    'CHINA / CAN / CAN',
    'CHINA / SHA / TOWN OFFICE',

    'FRANCE / PAR / PAR',

    'INDIA / BLR / AIRPORT OFFICE',
    'INDIA / BLR / BLR',
    'INDIA / MAA / MAA',
    'INDIA / MAA / CARGO OFFICE',
    'INDIA / MAA / TOWN OFFICE',
    'INDIA / COK / AIRPORT OFFICE',
    'INDIA / COK / COK',
    'INDIA / DEL / DEL',
    'INDIA / HYD / HYD',
    'INDIA / BOM / AIRPORT OFFICE',
    'INDIA / BOM / BOM',
    'INDIA / IXM / IXM',
    'INDIA / IXM / MADURAI',
    'INDIA / TRV / TRV',
    'INDIA / TRZ / TRZ',
    'INDIA / TRZ / AIRPORT OFFICE',
    'INDIA / TRZ / TOWN OFFICE',

    'INDONESIA / JKT / JKT',
    'JAPAN / TYO / TYO',
    'KUWAIT / KWI / KWI',
    'MALAYSIA / KUL / KUL',
    'MALAYSIA / KUL / AIRPORT OFFICE',
    'MALDIVES / MLE / MLE',
    'PAKISTAN / KHI / KHI',
    'QATAR / DOH / DOH',
    'SAUDI ARABIA / DMM / AIRPORT OFFICE',
    'SINGAPORE / SIN / SIN',
    'SINGAPORE / SIN / TOWN OFFICE',
    'THAILAND / BKK / BKK',
    'UNITED ARAB EMIRATES / DXB / AIRPORT OFFICE',
    'UNITED ARAB EMIRATES / DXB / DXB',
    'UNITED KINGDOM / LON / AIRPORT OFFICE',
    'UNITED KINGDOM / LON / TOWN OFFICE',
    'UNITED KINGDOM / LON / LON'
  ];

  staffNo = signal('');
  lastName = signal('');
  otherNames = signal('');
  initials = signal('');
  displayName = signal('');

  extension1: PhoneField = this.defaultPhone();
  extension2: PhoneField = this.defaultPhone();
  mobileNo: PhoneField = this.defaultPhone();
  homePhone: PhoneField = this.defaultPhone();
  fax: PhoneField = this.defaultPhone();

  // Every phone field defaults to Sri Lanka (+94) since this is a
  // SriLankan Airlines internal tool.
  private defaultPhone(): PhoneField {
    return { iso2: 'lk', code: getCountryCallingCode('LK'), number: '' };
  }

  designation = signal('');
  office = signal('');
  section = signal('');
  costCenter = signal('');
  department = signal('');
  division = signal('');

  permanentAddress = signal('');
  galAddress = signal('');
  useAboveAsGal = signal(false);

  openDropdown = signal<string | null>(null);
  countrySearch = signal('');

  officeSearch = signal('');

  filteredOffices = computed(() => {
    const q = this.officeSearch().trim().toLowerCase();
    if (!q) return this.offices;
    return this.offices.filter(o => o.toLowerCase().includes(q));
  });

  private buildCountries(): Country[] {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return getCountries()
      .map(code => ({
        name: regionNames.of(code) ?? code,
        iso2: code.toLowerCase(),
        dial: getCountryCallingCode(code)
      }))
      .sort((a, b) => {
        if (a.iso2 === 'lk') return -1;
        if (b.iso2 === 'lk') return 1;
        return a.name.localeCompare(b.name);
      });
  }

  countries: Country[] = this.buildCountries();

  filteredCountries = computed(() => {
    const q = this.countrySearch().trim().toLowerCase();
    if (!q) return this.countries;
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(q) || c.dial.includes(q)
    );
  });

  avatarInitials = computed(() => {
    const parts = this.displayName().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  flagUrl(iso2: string): string {
    return `https://flagcdn.com/w20/${iso2}.png`;
  }

  toggleDropdown(key: string): void {
    const opening = this.openDropdown() !== key;
    this.openDropdown.set(opening ? key : null);
    this.countrySearch.set('');
    if (opening) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('.country-dropdown .country-search-input')?.focus();
      }, 50);
    }
  }

  closeDropdown(): void {
    this.openDropdown.set(null);
    this.countrySearch.set('');
  }

  toggleOfficeDropdown(): void {
    const opening = this.openDropdown() !== 'office';
    this.openDropdown.set(opening ? 'office' : null);
    this.officeSearch.set('');
    if (opening) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('.office-dropdown .office-search-input')?.focus();
      }, 50);
    }
  }

  selectOffice(o: string): void {
    this.office.set(o);
    this.closeDropdown();
  }

  selectCountry(field: PhoneField, country: Country): void {
    field.iso2 = country.iso2;
    field.code = country.dial;
    this.closeDropdown();
  }

  onPhoneNumberInput(field: PhoneField, value: string, inputEl: HTMLInputElement): void {
    const cleaned = value.replace(/\D/g, '').replace(/^0+/, '');
    field.number = cleaned;
    inputEl.value = cleaned;
  }

  isPhoneValid(field: PhoneField): boolean {
    if (!field.number.trim() || !field.iso2) return true;
    return isValidPhoneNumber(field.number, field.iso2.toUpperCase() as CountryCode);
  }

  onUseAboveAsGalChange(checked: boolean): void {
    this.useAboveAsGal.set(checked);
    if (checked) {
      this.galAddress.set(this.permanentAddress());
    }
  }

  onPermanentAddressChange(value: string): void {
    this.permanentAddress.set(value);
    if (this.useAboveAsGal()) {
      this.galAddress.set(value);
    }
  }

  reset(): void {
    this.staffNo.set('');
    this.lastName.set('');
    this.otherNames.set('');
    this.initials.set('');
    this.displayName.set('');
    this.extension1 = this.defaultPhone();
    this.extension2 = this.defaultPhone();
    this.mobileNo = this.defaultPhone();
    this.homePhone = this.defaultPhone();
    this.fax = this.defaultPhone();
    this.designation.set('');
    this.office.set('');
    this.section.set('');
    this.costCenter.set('');
    this.department.set('');
    this.division.set('');
    this.permanentAddress.set('');
    this.galAddress.set('');
    this.useAboveAsGal.set(false);
  }

  save(): void {
    const payload = {
      staffNo: this.staffNo(),
      lastName: this.lastName(),
      otherNames: this.otherNames(),
      initials: this.initials(),
      displayName: this.displayName(),
      extension1: this.extension1,
      extension2: this.extension2,
      mobileNo: this.mobileNo,
      homePhone: this.homePhone,
      fax: this.fax,
      designation: this.designation(),
      office: this.office(),
      section: this.section(),
      costCenter: this.costCenter(),
      department: this.department(),
      division: this.division(),
      permanentAddress: this.permanentAddress(),
      galAddress: this.galAddress()
    };
    // Wire this up to your save endpoint
    console.log('Saving GAL entry', payload);
  }
}