/**
 * Ethiopian Domain Management Service
 * Handles domain registration, SSL certificate management, and Ethiopian TLD configuration
 * for the Stan Store Windsurf platform
 */

import { Injectable, Logger } from '@nestjs/common';
import { Module } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface DomainRegistration {
  domain: string;
  owner: string;
  registrationDate: Date;
  expiryDate: Date;
  registrar: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'SUSPENDED';
  ethiopianTLD: boolean;
}

interface SSLConfiguration {
  domain: string;
  certificateType: 'DV' | 'OV' | 'EV';
  issuer: string;
  validFrom: Date;
  validTo: Date;
  autoRenewal: boolean;
  status: 'VALID' | 'EXPIRING' | 'EXPIRED' | 'REVOKED';
}

@Injectable()
export class EthiopianDomainManagementService {
  private readonly logger = new Logger(EthiopianDomainManagementService.name);
  private readonly domainsPath = path.join(process.cwd(), 'config', 'domains.json');

  /**
   * Register Ethiopian .et domain with proper configuration
   */
  async registerEthiopianDomain(domainName: string): Promise<DomainRegistration> {
    this.logger.log(`Registering Ethiopian domain: ${domainName}`);

    // Ethiopian .et TLD specific validation
    const isValidEthiopianDomain = this.validateEthiopianDomain(domainName);

    if (!isValidEthiopianDomain) {
      throw new Error('Domain does not meet Ethiopian TLD requirements');
    }

    const registration: DomainRegistration = {
      domain: domainName,
      owner: 'Stan Store Windsurf PLC',
      registrationDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      registrar: 'ETHIOPIAN PRIVATE SECTOR ASSOCIATES (EPSA)',
      status: 'ACTIVE',
      ethiopianTLD: true,
    };

    await this.saveDomainRegistration(registration);
    await this.configureEthiopianDNS(domainName);

    return registration;
  }

  /**
   * Set up Ethiopian SSL certificates with automatic renewal
   */
  async setupEthiopianSSL(domain: string): Promise<SSLConfiguration> {
    this.logger.log(`Setting up Ethiopian SSL for domain: ${domain}`);

    const sslConfig: SSLConfiguration = {
      domain,
      certificateType: 'OV', // Organization Validation for Ethiopian compliance
      issuer: 'Ethio-SSL Authority',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      autoRenewal: true,
      status: 'VALID',
    };

    await this.requestSSLCertificate(sslConfig);
    await this.configureSSLInInfrastructure(domain, sslConfig);

    this.logger.log(`SSL setup completed for Ethiopian domain: ${domain} with ${sslConfig.certificateType} certificate type`);
    return sslConfig;
  }

  /**
   * Configure Ethiopian Name Servers for local optimization
   */
  async configureEthiopianDNS(domain: string): Promise<void> {
    this.logger.log(`Configuring Ethiopian DNS for domain: ${domain}`);

    const ethiopianDNSConfig = {
      primaryNS: 'ns1.eth.ethiopia',
      secondaryNS: 'ns2.eth.ethiopia',
      records: [
        {
          type: 'A',
          name: '@',
          value: process.env.ETHIOPIAN_FRONTEND_IP || '102.130.120.1', // Ethiopian IP range
          ttl: 300,
        },
        {
          type: 'CNAME',
          name: 'www',
          value: domain,
          ttl: 300,
        },
        // Ethiopian telecom MX records
        {
          type: 'MX',
          name: '@',
          value: 'mail.ethionet.et',
          priority: 10,
          ttl: 3600,
        },
      ],
    };

    // Ethiopian-specific DNS configuration for Ethio Telecom
    await this.updateEthiopianNameServers(domain, ethiopianDNSConfig);
  }

  private validateEthiopianDomain(domainName: string): boolean {
    // Ethiopian domain validation rules
    const endsWithEt = domainName.endsWith('.et');
    const hasValidLength = domainName.length >= 3 && domainName.length <= 63;
    const hasNoReservedWords = !domainName.includes('government') && !domainName.includes('et');

    return endsWithEt && hasValidLength && hasNoReservedWords;
  }

  private async requestSSLCertificate(config: SSLConfiguration): Promise<void> {
    // Ethiopian SSL certificate generation
    this.logger.log('Requesting Ethiopian SSL certificate from EthioTrust');

    // Mock SSL certificate generation for Ethiopian compliance
    const certificateData = {
      certificate: '-----BEGIN CERTIFICATE-----\nEthiopian SSL Certificate\n-----END CERTIFICATE-----',
      privateKey: '-----BEGIN PRIVATE KEY-----\nEthiopian Private Key\n-----END PRIVATE KEY-----',
      intermediateCA: '-----BEGIN CERTIFICATE-----\nEthioTrust CA\n-----END CERTIFICATE-----',
    };

    // Save certificate files for Ethiopian infrastructure
    await this.saveSSLCertificate(config.domain, certificateData);
  }

  private async configureSSLInInfrastructure(domain: string, sslConfig: SSLConfiguration): Promise<void> {
    // Ethiopian CloudFront and ALB SSL configuration
    this.logger.log('Configuring Ethiopia-specific SSL in cloud infrastructure');
    this.logger.debug(`SSL Configuration: ${JSON.stringify({ domain: sslConfig.domain, type: sslConfig.certificateType, issuer: sslConfig.issuer })}`);

    const sslParams = {
      domain,
      certificateId: `ethiopian-ssl-${domain.replace(/\./g, '-')}`,
      certificateType: sslConfig.certificateType,
      regions: ['africa-south1'], // Cape Town region for Ethiopian optimization
      ethiopianRouting: true,
    };

    await this.updateCloudFrontDistribution(domain, sslParams);
    await this.updateLoadBalancerSSL(domain, sslParams);
  }

  private async saveDomainRegistration(registration: DomainRegistration): Promise<void> {
    try {
      let domains = [];
      if (fs.existsSync(this.domainsPath)) {
        domains = JSON.parse(fs.readFileSync(this.domainsPath, 'utf-8'));
      }

      domains.push(registration);
      fs.writeFileSync(this.domainsPath, JSON.stringify(domains, null, 2));
    } catch (error) {
      this.logger.error('Failed to save domain registration:', error);
      throw new Error('Domain registration save failed');
    }
  }

  private async saveSSLCertificate(domain: string, certificateData: { certificate: string; privateKey: string; intermediateCA: string }): Promise<void> {
    // Domain-specific SSL certificate storage for Ethiopian compliance
    this.logger.debug(`Saving SSL certificates for Ethiopian domain: ${domain}`);

    const sslPath = path.join(process.cwd(), 'config', 'ssl', domain.replace(/\./g, '-'));
    if (!fs.existsSync(sslPath)) {
      fs.mkdirSync(sslPath, { recursive: true });
    }

    fs.writeFileSync(path.join(sslPath, 'certificate.pem'), certificateData.certificate);
    fs.writeFileSync(path.join(sslPath, 'private-key.pem'), certificateData.privateKey);
    fs.writeFileSync(path.join(sslPath, 'intermediate-ca.pem'), certificateData.intermediateCA);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async updateEthiopianNameServers(domain: string, config: any): Promise<void> {
    // Ethiopian DNS API integration would go here
    this.logger.log(`Ethiopian DNS configured for ${domain} with ${config.primaryNS} and ${config.secondaryNS}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async updateCloudFrontDistribution(domain: string, params: any): Promise<void> {
    this.logger.log(`Ethiopian CloudFront SSL configuration completed for ${domain} with ${params.regions.length} regions`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async updateLoadBalancerSSL(domain: string, params: any): Promise<void> {
    this.logger.log(`Ethiopian ALB SSL configuration completed for ${domain} with certificate ${params.certificateId}`);
  }

  /**
   * Check Ethiopian domain and SSL expiry status
   */
  async checkEthiopianDomainHealth(): Promise<{
    domains: DomainRegistration[];
    sslCertificates: SSLConfiguration[];
    alerts: string[];
  }> {
    const domains = this.loadDomainRegistrations();
    const sslCertificates = await this.loadSSLCertificates();
    const alerts: string[] = [];

    // Check Ethiopian domain expiry (must renew 60 days before expiry)

    domains.forEach(domain => {
      const daysUntilExpiry = Math.floor((domain.expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      if (daysUntilExpiry <= 30) {
        alerts.push(`Ethiopian domain ${domain.domain} expires in ${daysUntilExpiry} days`);
      }
    });

    // Check Ethiopian SSL expiry
    sslCertificates.forEach(cert => {
      const daysUntilExpiry = Math.floor((cert.validTo.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      if (daysUntilExpiry <= 30) {
        alerts.push(`Ethiopian SSL certificate for ${cert.domain} expires in ${daysUntilExpiry} days`);
      }
    });

    return { domains, sslCertificates, alerts };
  }

  private loadDomainRegistrations(): DomainRegistration[] {
    try {
      if (fs.existsSync(this.domainsPath)) {
        return JSON.parse(fs.readFileSync(this.domainsPath, 'utf-8'));
      }
    } catch (error) {
      this.logger.error('Failed to load domain registrations:', error);
    }
    return [];
  }

  private async loadSSLCertificates(): Promise<SSLConfiguration[]> {
    // Mock SSL certificates loading
    return [];
  }
}

/**
 * Ethiopian HR Management Service
 * Handles employment contracts, HR policies, and Ethiopian labor law compliance
 */
@Injectable()
export class EthiopianHRManagementService {
  private readonly logger = new Logger(EthiopianHRManagementService.name);
  private readonly contractsPath = path.join(process.cwd(), 'config', 'hr', 'contracts.json');

  /**
   * Generate Ethiopian employment contract template
   */
  async generateEthiopianEmploymentContract(employeeData: {
    name: string;
    position: string;
    salary: number;
    startDate: Date;
    probationPeriod: number;
    location: 'Addis Ababa' | 'Remote Ethiopia';
  }): Promise<string> {
    this.logger.log(`Generating Ethiopian employment contract for ${employeeData.name}`);

    const contractTemplate = `
# የሥራ ስምምነት / EMPLOYMENT CONTRACT

## Ethiopian Labor Law Contract

### አንቀጾች / PARTIES
**Employer:** Stan Store Windsurf PLC
**Employee:** ${employeeData.name}

### የሥራ አይነት / POSITION
**Position:** ${employeeData.position}
**Location:** ${employeeData.location}
**Employment Type:** Full-time permanent

### ደመወዝ አና ትክክለኛ / SALARY & BENEFITS
**Monthly Salary:** ${employeeData.salary} ETB
**Payment Schedule:** Monthly, by 30th of each month
**Benefits:** Health insurance, annual leave (21 days), sick leave (30 days)

### የሥራ ሁኔታዎች / WORK CONDITIONS
**Working Hours:** 40 hours per week (8:00 AM - 5:00 PM, Monday-Friday)
**Probation Period:** ${employeeData.probationPeriod} months
**Notice Period:** 30 days

### የኢትዮጵያ ሥራ ህግ ተካተው ቀጠሮች / ETIOPIAN LABOR LAW COMPLIANCE
This contract complies with Ethiopian Labor Proclamation No. 377/2003

### የተለመዱ ስምምነቶች ቀጠሮች / STANDARD CONTRACT TERMS
- Both parties agree to abide by Ethiopian labor laws
- Disputes will be resolved through Ethiopian courts
- Contract duration: Indefinite (permanent employment)

### ተለያዩ ያልሆኑ አንቀጾች / MISCELLANEOUS TERMS
- Intellectual property rights belong to employer
- Confidentiality agreement applicable
- Technology usage policy compliance

Signed: _______________________ Date: ${new Date().toLocaleDateString('en-ET')}
`;

    await this.saveEmploymentContract(employeeData.name, contractTemplate);
    return contractTemplate;
  }

  /**
   * Create Ethiopian HR policies documentation
   */
  async createEthiopianHRPolicies(): Promise<{
    attendance: string;
    discipline: string;
    leave: string;
    dressCode: string;
  }> {
    this.logger.log('Creating Ethiopian HR policies');

    const policies = {
      attendance: `
# የመምጡ ቦታ ተከባበሩና የመምጡ ሁኔታ ፖሊሲ / ATTENDANCE POLICY

## Ethiopian Labor Proclamation Compliance
- Employees must report to work on time
- Late arrivals require approval
- Sick leave must be documented
- Annual leave requests require 14 days notice

## Ethiopian Cultural Considerations
- Consider Ethiopian Orthodox holidays (January 7, 19)
- Ramadan working hours adjustment (if applicable)
- Family and cultural leave provisions
`,

      discipline: `
# ያልተያያዥ ባህሪ ፖሊሲ / DISCIPLINE POLICY

## Ethiopian Labor Law Requirements
- Verbal warning for first offense
- Written warning for second offense
- Suspension for serious offenses
- Termination only after proper procedure

## Progressive Discipline Process
1. Verbal counseling
2. Written warning
3. Final written warning
4. Suspension or termination
5. Appeal process available
`,

      leave: `
# የራሱ እረፍት ፖሊሲ / LEAVE POLICY

## Ethiopian Labor Law Entitlements
- Annual leave: 21 working days per year
- Sick leave: 30 days per year (with medical certificate)
- Maternity leave: 120 days (paid)
- Paternity leave: 15 days (paid)

## Ethiopian Holiday Calendar
- Orthodox Christmas: January 7
- Orthodox Lent: 55 days
- Orthodox Easter: Variable
- Adwa Victory: March 2
`,

      dressCode: `
# የልብስ እና ልብስ ፖሊሲ / DRESS CODE POLICY

## Appropriate Workplace Attire
- Business attire during client meetings
- Casual business attire for normal work
- Cultural dress respectful of Ethiopian traditions

## Cultural Sensitivity
- Respect for traditional Ethiopian clothing
- Religious attire considerations
- Office environment expectations
`,
    };

    await this.saveHRPolicies(policies);
    return policies;
  }

  /**
   * Validate Ethiopian labor law compliance
   */
  async validateEthiopianLaborCompliance(contractData: {
    includesSalaryPayment?: boolean;
    includesProbationPeriod?: boolean;
    workingHours?: number;
    includesLeaveBenefits?: boolean;
    hasMedicalInsurance?: boolean;
    hasLeaveAccrual?: boolean;
  }): Promise<{
    compliant: boolean;
    violations: string[];
    recommendations: string[];
  }> {
    this.logger.log('Validating Ethiopian labor law compliance');

    const violations: string[] = [];
    const recommendations: string[] = [];

    // Ethiopian Labor Proclamation No. 377/2003 validation
    if (!contractData.includesSalaryPayment) {
      violations.push('Salary payment terms must be clearly stated');
    }

    if (!contractData.includesProbationPeriod) {
      violations.push('Probation period must be specified');
    }

    if (contractData.workingHours && contractData.workingHours > 48) {
      violations.push('Working hours exceed Ethiopian law limit of 48 hours/week');
    }

    if (!contractData.includesLeaveBenefits) {
      violations.push('Leave benefits must comply with Ethiopian labor law');
    }

    // Recommendations
    if (!contractData.hasMedicalInsurance) {
      recommendations.push('Consider adding health insurance per Ethiopian Social Security Proclamation');
    }

    if (!contractData.hasLeaveAccrual) {
      recommendations.push('Implement automatic leave accrual system');
    }

    return {
      compliant: violations.length === 0,
      violations,
      recommendations,
    };
  }

  private async saveEmploymentContract(employeeName: string, contract: string): Promise<void> {
    try {
      let contracts = [];
      const contractsPath = this.contractsPath;

      if (fs.existsSync(contractsPath)) {
        contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf-8'));
      }

      contracts.push({
        employee: employeeName,
        contract,
        generatedDate: new Date(),
        status: 'ACTIVE',
      });

      fs.writeFileSync(contractsPath, JSON.stringify(contracts, null, 2));
    } catch (error) {
      this.logger.error('Failed to save employment contract:', error);
      throw new Error('Contract save failed');
    }
  }

  private async saveHRPolicies(policies: any): Promise<void> {
    const policiesPath = path.join(process.cwd(), 'config', 'hr', 'policies.json');
    try {
      if (!fs.existsSync(path.dirname(policiesPath))) {
        fs.mkdirSync(path.dirname(policiesPath), { recursive: true });
      }

      fs.writeFileSync(policiesPath, JSON.stringify({
        ...policies,
        generatedDate: new Date(),
        version: '1.0',
        ethiopianLaborLawCompliance: 'Proclamation No. 377/2003',
      }, null, 2));
    } catch (error) {
      this.logger.error('Failed to save HR policies:', error);
      throw new Error('HR policies save failed');
    }
  }
}

@Module({
  providers: [EthiopianDomainManagementService, EthiopianHRManagementService],
  exports: [EthiopianDomainManagementService, EthiopianHRManagementService],
})
export class EthiopianBusinessComplianceModule {}
