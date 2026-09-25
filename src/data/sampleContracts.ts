export interface SampleContract {
  id: string;
  name: string;
  docType: 'Contract' | 'Lease Agreement' | 'NDA' | 'Terms of Service' | 'Employment';
  parties: string[];
  description: string;
  content: string;
  revisedVersion?: string; // For testing 1-click comparison!
}

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'residential-lease',
    name: 'Residential Tenancy Lease Agreement',
    docType: 'Lease Agreement',
    parties: ['Apex Real Estate Holdings LLC', 'John Doe'],
    description: 'A standard-looking residential rental lease containing aggressive landlord clauses, unannounced entry rights, and forfeiture traps.',
    content: `RESIDENTIAL APARTMENT LEASE AGREEMENT

This Agreement is made this 1st day of October 2026, by and between Apex Real Estate Holdings LLC (hereinafter "Landlord"), and John Doe (hereinafter "Tenant").

1. PREMISES & TERM
Landlord hereby leases to Tenant Apartment 4B located at 124 Magnolia Court, Austin, Texas. The lease term shall be for twenty-four (24) months, commencing November 1, 2026. This Agreement shall automatically renew for additional twelve (12) month periods unless Tenant provides written notice via certified mail exactly ninety (90) days prior to expiration.

2. RENT & PENALTIES
Tenant shall pay a monthly rent of $2,400.00 due on the first day of each month. If rent is received after the 2nd calendar day of the month, a liquidated late fee of $150.00 plus $25.00 per day shall accrue immediately.

3. SECURITY DEPOSIT & FORFEITURE
Tenant shall deposit with Landlord the sum of $4,800.00 (two months rent) as security. In the event Tenant terminates this Agreement prior to the expiration of the 24-month term for any reason whatsoever, including job relocation or medical necessity, the entire security deposit shall be unconditionally forfeited to Landlord as liquidated damages.

4. RIGHT OF INSPECTION & ENTRY
Landlord and Landlord's agents reserve the unrestricted right to enter the Premises at any time, day or night, with or without prior notice to Tenant, for purposes of inspection, maintenance, or showing the property to prospective buyers or tenants.

5. REPAIRS & HABITABILITY
Tenant shall be solely responsible for all maintenance, repairs, plumbing unclogging, HVAC servicing, and appliance replacements exceeding $50.00 in cost, regardless of whether said defect resulted from normal wear and tear or pre-existing conditions.

6. INDEMNIFICATION & HOLD HARMLESS
Tenant covenants to defend, indemnify, and hold harmless Landlord against any and all claims, bodily injuries, property damage, or losses occurring on the Premises, even if caused by the sole negligence or fault of Landlord or Landlord's contractors.

7. DISPUTE RESOLUTION
Tenant expressly waives all rights to trial by jury and agrees that any dispute arising under this Agreement shall be submitted to confidential binding arbitration at a venue chosen solely by Landlord, with all administrative filing fees borne exclusively by Tenant.`,
    revisedVersion: `RESIDENTIAL APARTMENT LEASE AGREEMENT (FAIR & TENANT-FRIENDLY REVISION)

This Agreement is made this 1st day of October 2026, by and between Apex Real Estate Holdings LLC ("Landlord"), and John Doe ("Tenant").

1. PREMISES & TERM
Landlord leases to Tenant Apartment 4B at 124 Magnolia Court, Austin, TX. The lease term is for twelve (12) months, commencing November 1, 2026. The lease transitions to a month-to-month tenancy upon expiration unless either party gives thirty (30) days written notice.

2. RENT & PENALTIES
Tenant agrees to pay $2,400.00 monthly by the 1st of each month. A grace period is provided until the 5th day. If unpaid by the 5th, a reasonable late fee of $50.00 applies.

3. SECURITY DEPOSIT
Tenant deposits $2,400.00 (one month rent) as security. The deposit shall be held in an interest-bearing escrow account and returned within thirty (30) days of move-out, minus itemized actual damages beyond normal wear and tear.

4. INSPECTION & ENTRY
Landlord may enter the Premises only during reasonable business hours (9:00 AM - 6:00 PM) upon giving Tenant at least twenty-four (24) hours advance written notice, except in genuine emergencies (active fire or flooding).

5. REPAIRS & HABITABILITY
Landlord remains legally responsible for maintaining the structural elements, heating, plumbing, electrical systems, and major appliances in habitable condition, at Landlord's sole expense.

6. MUTUAL INDEMNIFICATION
Each party agrees to be responsible for its own negligent acts or willful misconduct. Tenant shall not be held liable for damages resulting from Landlord's negligence.

7. DISPUTE RESOLUTION
Disputes shall first be mediated in good faith in the county where the property is located. Both parties retain their rights under local housing tenant protection statutes.`
  },
  {
    id: 'freelance-contractor',
    name: 'Freelance Software Developer Agreement',
    docType: 'Contract',
    parties: ['Global Tech Enterprises Inc.', 'Jane Smith'],
    description: 'An aggressive B2B master services agreement shifting unlimited liability and intellectual property ownership onto a freelance consultant.',
    content: `MASTER INDEPENDENT CONTRACTOR AGREEMENT

This Agreement is entered into by Global Tech Enterprises Inc. ("Company") and Jane Smith ("Contractor").

1. SCOPE OF SERVICES & INDEPENDENT STATUS
Contractor shall develop and deliver custom software modules according to Statements of Work issued by Company. Contractor is an independent contractor and not an employee.

2. ASSIGNMENT OF ALL INVENTIONS & INTELLECTUAL PROPERTY
Contractor hereby irrevocably assigns, transfers, and conveys to Company all right, title, and interest in and to all inventions, code, designs, algorithms, and works of authorship created, conceived, or reduced to practice by Contractor during the term of this Agreement, whether or not related to Company's business and whether created during or outside work hours.

3. PAYMENT TERMS & HOLDBACK
Company shall remit payment within ninety (90) days following formal written acceptance of completed deliverables. Company reserves the unilateral right to withhold up to 30% of total invoice amounts for any perceived defects in Contractor's deliverables for a period of six (6) months.

4. UNLIMITED INDEMNIFICATION
Contractor shall defend, indemnify, and hold harmless Company, its officers, affiliates, and customers from and against any and all claims, damages, liabilities, losses, costs, and attorney fees arising directly or indirectly from Contractor's services, without monetary cap or limitation of liability.

5. NON-COMPETITION & NON-SOLICITATION
During the term of this Agreement and for a period of twenty-four (24) months following termination, Contractor shall not provide software development, consulting, or related services to any entity in the technology sector globally that competes with Company.

6. TERMINATION
Company may terminate this Agreement at any time with or without cause upon twenty-four (24) hours notice. Contractor may not terminate this Agreement until all pending milestones are delivered and accepted.`,
    revisedVersion: `STANDARD INDEPENDENT CONTRACTOR AGREEMENT (BALANCED)

This Agreement is entered into by Global Tech Enterprises Inc. ("Company") and Jane Smith ("Contractor").

1. SCOPE OF SERVICES
Contractor shall provide software consulting services as defined in specific Statements of Work.

2. INTELLECTUAL PROPERTY
Upon receipt of full payment, Contractor assigns to Company all rights to custom code created specifically for Company under this Agreement. Contractor retains all ownership in pre-existing libraries, tools, frameworks, and background IP.

3. PAYMENT TERMS
Payment is due net thirty (30) days from invoice date. No arbitrary holdbacks are permitted. Late payments accrue interest at 1.5% per month.

4. MUTUAL LIMITATION OF LIABILITY
Neither party shall be liable for indirect or consequential damages. Each party's aggregate liability under this Agreement is strictly capped at the total fees paid to Contractor in the preceding twelve (12) months.

5. NON-SOLICITATION ONLY
Contractor agrees not to solicit Company's employees for twelve (12) months. There is no restriction on Contractor's general right to provide software services to other clients or competitors.

6. MUTUAL TERMINATION
Either party may terminate this Agreement for convenience upon fourteen (14) days written notice, with Company paying Contractor for all hours worked through the date of termination.`
  },
  {
    id: 'confidentiality-nda',
    name: 'Unilateral Non-Disclosure Agreement (NDA)',
    docType: 'NDA',
    parties: ['Venture Corp Capital', 'Innovatech Labs'],
    description: 'An asymmetrical NDA imposing perpetual secrecy, vague confidentiality scopes, and unilateral liquidated damages.',
    content: `CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement is made between Venture Corp Capital ("Disclosing Party") and Innovatech Labs ("Receiving Party").

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" shall include all information, whether oral, written, visual, or digital, disclosed by Disclosing Party, including but not limited to business ideas, casual conversations, financial projections, customer identities, and general market concepts, whether or not marked as confidential.

2. PERPETUAL OBLIGATION
Receiving Party covenants and agrees to hold all Confidential Information in strictest confidence in perpetuity, with obligations surviving indefinitely following the conclusion of commercial discussions.

3. LIQUIDATED DAMAGES
Receiving Party acknowledges that any disclosure, inadvertent or intentional, will cause irreparable harm. In the event of any breach, Receiving Party shall pay Disclosing Party the sum of $100,000 as agreed liquidated damages per occurrence, in addition to Disclosing Party's full legal fees.

4. EXCLUSIONS RESTRICTION
Information shall only be excluded from confidentiality if Receiving Party can prove by clear and convincing documentary evidence that such information was already in the public domain prior to disclosure.

5. GOVERNING LAW & UNILATERAL INJUNCTION
This Agreement shall be governed by Delaware law. Disclosing Party shall be entitled to seek immediate preliminary injunctive relief without the necessity of posting a bond or proving monetary damages.`
  },
  {
    id: 'saas-terms',
    name: 'Cloud SaaS Service Terms of Service',
    docType: 'Terms of Service',
    parties: ['OmniCloud Platform Inc.', 'Subscriber'],
    description: 'A modern cloud software terms of service with unilateral price hikes, data lock-in, and forced arbitration.',
    content: `OMNICLOUD PLATFORM TERMS OF SERVICE

1. SERVICE LICENSE & UNILATERAL MODIFICATIONS
OmniCloud grants Subscriber a non-exclusive license to access the Platform. OmniCloud reserves the sole right to alter, modify, suspend, or discontinue any feature, and to adjust pricing upon twenty-four (24) hours email notice. Continued usage constitutes binding acceptance.

2. DATA OWNERSHIP & DERIVATIVE WORKS
Subscriber retains ownership of raw input data. However, Subscriber grants OmniCloud a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, aggregate, train machine learning models upon, and monetize all subscriber data and metadata.

3. DISCLAIMER OF ALL WARRANTIES
THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE". OMNICLOUD EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND CONTINUOUS UPTIME. OMNICLOUD DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.

4. AGGREGATE LIABILITY CAP
OMNICLOUD'S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS WHATSOEVER SHALL BE STRICTLY LIMITED TO THE GREATER OF $50.00 OR THE AMOUNT PAID BY SUBSCRIBER IN THE ONE (1) MONTH PRECEDING THE CLAIM.

5. MANDATORY ARBITRATION & CLASS ACTION WAIVER
All claims shall be resolved exclusively through individual binding arbitration. Subscriber explicitly waives the right to participate in any class action lawsuit or class-wide arbitration against OmniCloud.`
  }
];
