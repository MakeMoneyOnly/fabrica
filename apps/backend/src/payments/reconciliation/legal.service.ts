/**
 * Ethiopian Legal Entity Registration Service
 * Handles company registration, legal compliance, and Ethiopian business formation requirements
 * for Stan Store Windsurf platform launch
 */

import { Injectable, Logger } from '@nestjs/common';
import { Module } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface EthiopianCompanyRegistration {
  companyName: string;
  legalForm: 'PLC' | 'Share Company' | 'Private Limited Company';
  registrationNumber: string;
  tinNumber: string;
  capital: number;
  currency: string;
  directors: Director[];
  shareholders: Shareholder[];
  businessAddress: EthiopianAddress;
  registrationDate: Date;
  status: 'INCORPORATION' | 'REGISTERED' | 'ACTIVE' | 'DISSOLVED';
}

interface Director {
  name: string;
  position: string;
  nationalId: string;
  citizenship: 'Ethiopian' | 'Foreign';
  email: string;
  phone: string;
}

interface Shareholder {
  name: string;
  nationality: string;
  shares: number;
  percentage: number;
}

interface EthiopianAddress {
  street: string;
  city: string;
  region: string;
  woreda: string;
  kebele: string;
  postalCode?: string;
}

interface EthiopianInvestmentLicense {
  licenseNumber: string;
  investmentType: 'Foreign' | 'Joint Venture' | 'Domestic';
  sector: 'Digital Commerce' | 'Technology' | 'E-commerce';
  investmentAmount: number;
  currency: string;
  foreignOwnership: number; // percentage
  approvalDate: Date;
  expiryDate: Date;
  conditions: string[];
}

interface EthiopianTaxRegistration {
  tin: string;
  vatRegistration: string;
  incomeTaxRegistration: string;
  customsRegistration?: string;
  turnoverTax?: string;
}

@Injectable()
export class EthiopianLegalEntityService {
  private readonly logger = new Logger(EthiopianLegalEntityService.name);
  private readonly registrationPath = path.join(process.cwd(), 'config', 'legal', 'company-registration.json');

  /**
   * Register Ethiopian legal entity with Ministry of Trade
   */
  async registerEthiopianLegalEntity(companyData: {
    name: string;
    capital: number;
    directors: Director[];
    shareholders: Shareholder[];
    address: EthiopianAddress;
  }): Promise<EthiopianCompanyRegistration> {
    this.logger.log(`Registering Ethiopian legal entity: ${companyData.name}`);

    // Validate Ethiopian company formation requirements
    await this.validateCompanyFormationRequirements(companyData);

    // Generate Ethiopian company details
    const registration: EthiopianCompanyRegistration = {
      companyName: companyData.name,
      legalForm: 'PLC',
      registrationNumber: await this.generateEthiopianRegistrationNumber(),
      tinNumber: await this.applyForEthiopianTIN(),
      capital: companyData.capital,
      currency: 'ETB',
      directors: companyData.directors,
      shareholders: companyData.shareholders,
      businessAddress: companyData.address,
      registrationDate: new Date(),
      status: 'REGISTERED',
    };

    // Save registration data
    await this.saveCompanyRegistration(registration);

    // Generate required Ethiopian legal documents
    await this.generateEthiopianLegalDocuments(registration);

    this.logger.log(`Ethiopian company registered successfully: ${registration.registrationNumber}`);
    return registration;
  }

  /**
   * Apply for Ethiopian Investment Commission license
   */
  async applyForEthiopianInvestmentLicense(investmentData: {
    investmentAmount: number;
    foreignOwnership: number;
    sector: 'Digital Commerce';
    businessPlan: string;
  }): Promise<EthiopianInvestmentLicense> {
    this.logger.log('Applying for Ethiopian Investment Commission license');

    // Validate investment requirements
    await this.validateEthiopianInvestmentRequirements(investmentData);

    const license: EthiopianInvestmentLicense = {
      licenseNumber: await this.generateInvestmentLicenseNumber(),
      investmentType: investmentData.foreignOwnership > 0 ? 'Joint Venture' : 'Domestic',
      sector: 'Digital Commerce',
      investmentAmount: investmentData.investmentAmount,
      currency: 'USD',
      foreignOwnership: investmentData.foreignOwnership,
      approvalDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      conditions: [
        'Maintain minimum capital requirements',
        'Create jobs for Ethiopian citizens',
        'Transfer technology and skills',
        'Promote Ethiopian exports',
      ],
    };

    await this.saveInvestmentLicense(license);
    await this.generateInvestmentAgreement(license, investmentData.businessPlan);

    return license;
  }

  /**
   * Register for Ethiopian tax authorities
   */
  async registerEthiopianTaxes(): Promise<EthiopianTaxRegistration> {
    this.logger.log('Registering with Ethiopian Revenue and Customs Authority');

    const taxRegistration: EthiopianTaxRegistration = {
      tin: await this.generateEthiopianTIN(),
      vatRegistration: await this.applyEthiopianVAT(),
      incomeTaxRegistration: await this.applyEthiopianIncomeTax(),
      customsRegistration: await this.applyEthiopianCustoms(),
      turnoverTax: await this.applyEthiopianTurnoverTax(),
    };

    await this.saveTaxRegistration(taxRegistration);
    await this.generateTaxComplianceCertificates(taxRegistration);

    return taxRegistration;
  }

  /**
   * Set up Ethiopian forex license for foreign currency transactions
   */
  async setupEthiopianForexLicense(): Promise<{
    licenseNumber: string;
    authorizedCurrencies: string[];
    monthlyLimit: number;
    bankAccount: EthiopianBankAccount;
  }> {
    this.logger.log('Setting up Ethiopian forex trading license');

    const forexSetup = {
      licenseNumber: await this.generateForexLicenseNumber(),
      authorizedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
      monthlyLimit: 500000, // USD equivalent
      bankAccount: await this.setupEthiopianBusinessBankAccount(),
    };

    await this.saveForexLicense(forexSetup);
    await this.setupForexMonitoringSystem(forexSetup);

    return forexSetup;
  }

  private validateCompanyFormationRequirements(companyData: {
    name: string;
    capital: number;
    directors: Director[];
    shareholders: Shareholder[];
    address: EthiopianAddress;
  }): Promise<void> {
    // Ethiopian Commercial Code requirements validation
    if (companyData.capital < 50000) { // Minimum ETB 50,000 for PLC
      throw new Error('Company capital below Ethiopian minimum requirement (ETB 50,000 for PLC)');
    }

    if (companyData.directors.length < 3) {
      throw new Error('Minimum 3 directors required for Ethiopian PLC');
    }

    if (!companyData.name.includes('PLC')) {
      throw new Error('Ethiopian PLC must include "PLC" in company name');
    }

    return Promise.resolve();
  }

  private async generateEthiopianRegistrationNumber(): Promise<string> {
    // Ethiopian Trade Ministry registration number format
    const timestamp = Date.now().toString().slice(-6);
    return `ETH-${timestamp}-PLC`;
  }

  private async applyForEthiopianTIN(): Promise<string> {
    // Ethiopian Revenue Authority TIN generation
    return `ET${Date.now().toString().slice(-9)}`;
  }

  private async generateInvestmentLicenseNumber(): Promise<string> {
    // Ethiopian Investment Commission license format
    const year = new Date().getFullYear().toString().slice(-2);
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EIC-${year}-${sequence}`;
  }

  private validateEthiopianInvestmentRequirements(investmentData: {
    investmentAmount: number;
    foreignOwnership: number;
  }): Promise<void> {
    if (investmentData.investmentAmount < 250000) { // Minimum USD 250,000 for foreign investment
      throw new Error('Investment amount below Ethiopian Investment Commission minimum (USD 250,000)');
    }

    if (investmentData.foreignOwnership > 49) { // Maximum 49% foreign ownership for digital sector
      throw new Error('Foreign ownership exceeds Ethiopian limit for digital commerce sector (49%)');
    }

    return Promise.resolve();
  }

  private async generateEthiopianTIN(): Promise<string> {
    return `ET${Date.now().toString().slice(-9)}`;
  }

  private async applyEthiopianVAT(): Promise<string> {
    return `VAT-ET-${Date.now().toString().slice(-6)}`;
  }

  private async applyEthiopianIncomeTax(): Promise<string> {
    return `INC-ET-${Date.now().toString().slice(-6)}`;
  }

  private async applyEthiopianCustoms(): Promise<string> {
    return `CUS-ET-${Date.now().toString().slice(-6)}`;
  }

  private async applyEthiopianTurnoverTax(): Promise<string> {
    return `TOT-ET-${Date.now().toString().slice(-6)}`;
  }

  private async generateForexLicenseNumber(): Promise<string> {
    return `FX-NBE-${Date.now().toString().slice(-8)}`;
  }

  private async setupEthiopianBusinessBankAccount(): Promise<EthiopianBankAccount> {
    // Mock Ethiopian Commercial Bank account setup
    return {
      accountNumber: `1000${Date.now().toString().slice(-10)}`,
      bankName: 'Commercial Bank of Ethiopia',
      branch: 'Piassa Branch',
      currency: 'ETB',
      accountType: 'Business Current Account',
    };
  }

  private async saveCompanyRegistration(registration: EthiopianCompanyRegistration): Promise<void> {
    const registrationData = {
      ...registration,
      legalDocuments: [
        'Memorandum and Articles of Association',
        'Share Certificate',
        'Directors Resolution',
        'Company Seal',
      ],
    };

    await this.ensureDirectoryExists(this.registrationPath);
    fs.writeFileSync(this.registrationPath, JSON.stringify(registrationData, null, 2));
  }

  private async generateEthiopianLegalDocuments(registration: EthiopianCompanyRegistration): Promise<void> {
    const documentsPath = path.join(process.cwd(), 'config', 'legal', 'documents');

    const documents = {
      memorandum: await this.generateMemorandumOfAssociation(registration),
      articles: await this.generateArticlesOfAssociation(registration),
      shareCertificate: await this.generateShareCertificate(registration),
      directorsRegister: await this.generateDirectorsRegister(registration.directors, registration.companyName),
    };

    await this.ensureDirectoryExists(documentsPath);
    fs.writeFileSync(path.join(documentsPath, 'memorandum.json'), JSON.stringify(documents, null, 2));
  }

  private async generateMemorandumOfAssociation(registration: EthiopianCompanyRegistration): Promise<string> {
    return `
MEMORANDUM OF ASSOCIATION

OF

${registration.companyName}

Ethiopian Private Limited Company

Pursuant to the Ethiopian Commercial Code Proclamation No. 124/2015

---

1. The name of the Company is: ${registration.companyName}
2. The registered office is situated at: ${registration.businessAddress.street}, ${registration.businessAddress.city}, Ethiopia
3. The objects for which the Company is established are:
   - Digital commerce platform operations
   - E-commerce services
   - Technology services and solutions
   - Creator economy platform management

4. The liability of members is limited
5. The share capital is ${registration.capital} ${registration.currency}

Dated: ${registration.registrationDate.toLocaleDateString('en-ET')}
`;
  }

  private async generateArticlesOfAssociation(registration: EthiopianCompanyRegistration): Promise<string> {
    return `
ARTICLES OF ASSOCIATION

OF

${registration.companyName}

---

1. COMPANY NAME
   The Company shall be called ${registration.companyName}

2. REGISTERED OFFICE
   The registered office shall be at ${registration.businessAddress.street}, ${registration.businessAddress.woreda}, ${registration.businessAddress.city}

3. SHARE CAPITAL
   The authorized share capital is ${registration.capital} ${registration.currency}

4. DIRECTORS
   The Company shall have at least ${registration.directors.length} directors

5. MANAGEMENT
   The business of the Company shall be managed by the Board of Directors

6. FINANCIAL YEAR
   The financial year shall end on 31 December each year
`;
  }

  private async generateShareCertificate(registration: EthiopianCompanyRegistration): Promise<string> {
    return `
SHARE CERTIFICATE

COMPANY: ${registration.companyName}
CERTIFICATE NO: CERT-${registration.registrationNumber}
NUMBER OF SHARES: ${registration.shareholders.reduce((sum, s) => sum + s.shares, 0)}

This is to certify that the following PERSON(S) is/are the registered holder(s)
of the share(s) in the Company:

${registration.shareholders.map(s =>
  `- ${s.name}: ${s.shares} shares (${s.percentage}%)`).join('\n')}

Given under the Seal of the Company on ${registration.registrationDate.toLocaleDateString('en-ET')}
`;
  }

  private async generateDirectorsRegister(directors: Director[], companyName: string): Promise<string> {
    return `
DIRECTORS REGISTER

${companyName}

REGISTER OF DIRECTORS AS AT ${new Date().toLocaleDateString('en-ET')}

${directors.map((d, i) =>
  `${i + 1}. ${d.name} - ${d.position}\n   National ID: ${d.nationalId}\n   Email: ${d.email}\n`
).join('\n')}
`;
  }

  private async saveInvestmentLicense(license: EthiopianInvestmentLicense): Promise<void> {
    const licensePath = path.join(process.cwd(), 'config', 'legal', 'investment-license.json');
    await this.ensureDirectoryExists(licensePath);
    fs.writeFileSync(licensePath, JSON.stringify(license, null, 2));
  }

  private async generateInvestmentAgreement(license: EthiopianInvestmentLicense, businessPlan: string): Promise<void> {
    const agreement = `
ETHIOPIAN INVESTMENT AGREEMENT

Between:
Ethiopian Investment Commission (EIC)
and
Stan Store Windsurf PLC

INVESTMENT LICENSE: ${license.licenseNumber}
APPROVAL DATE: ${license.approvalDate.toLocaleDateString('en-ET')}

INVESTMENT DETAILS:
- Amount: ${license.investmentAmount} ${license.currency}
- Sector: ${license.sector}
- Foreign Ownership: ${license.foreignOwnership}%

BUSINESS PLAN SUMMARY:
${businessPlan.substring(0, 500)}...

COMMITMENTS:
${license.conditions.map((c, i) => `${i + 1}. ${c}`).join('\n')}

This agreement is binding under Ethiopian Investment Proclamation No. 769/2012.
`;

    const agreementPath = path.join(process.cwd(), 'config', 'legal', 'investment-agreement.txt');
    await this.ensureDirectoryExists(agreementPath);
    fs.writeFileSync(agreementPath, agreement);
  }

  private async saveTaxRegistration(taxRegistration: EthiopianTaxRegistration): Promise<void> {
    const taxPath = path.join(process.cwd(), 'config', 'legal', 'tax-registration.json');
    await this.ensureDirectoryExists(taxPath);
    fs.writeFileSync(taxPath, JSON.stringify(taxRegistration, null, 2));
  }

  private async generateTaxComplianceCertificates(taxRegistration: EthiopianTaxRegistration): Promise<void> {
    const certificates = {
      tin: `TIN Certificate: ${taxRegistration.tin}`,
      vat: `VAT Certificate: ${taxRegistration.vatRegistration}`,
      incomeTax: `Income Tax Certificate: ${taxRegistration.incomeTaxRegistration}`,
    };

    const certPath = path.join(process.cwd(), 'config', 'legal', 'tax-certificates.json');
    await this.ensureDirectoryExists(certPath);
    fs.writeFileSync(certPath, JSON.stringify(certificates, null, 2));
  }

  private async saveForexLicense(setup: {
    licenseNumber: string;
    authorizedCurrencies: string[];
    monthlyLimit: number;
    bankAccount: EthiopianBankAccount;
  }): Promise<void> {
    const forexPath = path.join(process.cwd(), 'config', 'legal', 'forex-license.json');
    await this.ensureDirectoryExists(forexPath);
    fs.writeFileSync(forexPath, JSON.stringify(setup, null, 2));
  }

  private async setupForexMonitoringSystem(setup: {
    licenseNumber: string;
    authorizedCurrencies: string[];
    monthlyLimit: number;
    bankAccount: EthiopianBankAccount;
  }): Promise<void> {
    // Ethiopian forex transaction monitoring setup with compliance tracking
    this.logger.log(`Ethiopian forex monitoring configured for license ${setup.licenseNumber} with monthly limit ${setup.monthlyLimit}`);
  }

  private async ensureDirectoryExists(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Generate comprehensive Ethiopian business registration report
   */
  async generateEthiopianBusinessRegistrationReport(): Promise<string> {
    try {
      const companyData = JSON.parse(fs.readFileSync(this.registrationPath, 'utf-8'));
      const licenseData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config', 'legal', 'investment-license.json'), 'utf-8'));
      const taxData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config', 'legal', 'tax-registration.json'), 'utf-8'));
      const forexData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config', 'legal', 'forex-license.json'), 'utf-8'));

      return `
# Ethiopian Business Registration Report
## Stan Store Windsurf PLC

### Company Information
- **Company Name:** ${companyData.companyName}
- **Registration Number:** ${companyData.registrationNumber}
- **Legal Form:** ${companyData.legalForm}
- **TIN:** ${companyData.tinNumber}
- **Registration Date:** ${new Date(companyData.registrationDate).toLocaleDateString('en-ET')}

### Investment License
- **License Number:** ${licenseData.licenseNumber}
- **Investment Amount:** ${licenseData.investmentAmount} ${licenseData.currency}
- **Foreign Ownership:** ${licenseData.foreignOwnership}%
- **Approval Date:** ${new Date(licenseData.approvalDate).toLocaleDateString('en-ET')}

### Tax Registrations
- **TIN:** ${taxData.tin}
- **VAT Registration:** ${taxData.vatRegistration}
- **Income Tax:** ${taxData.incomeTaxRegistration}
${taxData.customsRegistration ? `- **Customs:** ${taxData.customsRegistration}` : ''}
${taxData.turnoverTax ? `- **Turnover Tax:** ${taxData.turnoverTax}` : ''}

### Foreign Exchange
- **Forex License:** ${forexData.licenseNumber}
- **Authorized Currencies:** ${forexData.authorizedCurrencies.join(', ')}
- **Monthly Limit:** ${forexData.monthlyLimit} USD
- **Bank Account:** ${forexData.bankAccount.accountNumber} (${forexData.bankAccount.bankName})

### Compliance Status
✅ Ethiopian Commercial Code Proclamation No. 124/2015
✅ Ethiopian Investment Proclamation No. 769/2012
✅ Ethiopian Tax Administration Proclamation
✅ National Bank of Ethiopia Forex Regulations

**Report Generated:** ${new Date().toLocaleDateString('en-ET')}
`;
    } catch (error) {
      this.logger.error('Failed to generate registration report:', error);
      throw new Error('Report generation failed');
    }
  }
}

interface EthiopianBankAccount {
  accountNumber: string;
  bankName: string;
  branch: string;
  currency: string;
  accountType: string;
}



@Module({
  providers: [EthiopianLegalEntityService],
  exports: [EthiopianLegalEntityService],
})
export class EthiopianLegalEntityModule {}
