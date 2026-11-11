# 22 Canal Street, London E2 8QR: Q3 2026 asset management update

**Fund:** Harbourline Property Fund I LP | **Period:** 1 July to 30 September 2026, with events to 10 November 2026 | **Prepared:** 11 November 2026 by the asset manager
**Checked against:** the Kestrel quarterly report (PM report), the rent roll as at 1 Nov 2026, the 4B lease, the 2A and 5C tenancies, the gas and EICR certificates, the registers (`units`, `compliance`, `contractors`), the inbox (m10–m21), the offering memorandum (OM) and the Millbrook service charge budget.

Source notation: `doc p.N "quote"`. Mails are cited as `inbox.json p.N` (one page per mail, in inbox order: m10 = p.1 … m21 = p.12). Registers are cited as `<name>.csv p.1`. Every quote is checked with `check/trace_check.py`.

## 1. Summary

- **Income:** the GBP 29,575 the PM report gives as demanded is correct. Collection was **93.4%**, not the 100% the PM report states. Flat 2A arrears were GBP 1,950 at quarter end and **GBP 3,900 at 1 November** (September and October).
- **Repairs:** **87.5%** of the 2026 budget was spent after nine months (GBP 5,250 of GBP 6,000), not 58%. Spend is not "on track". At this run rate the budget would be overspent by about GBP 1,000.
- **Compliance is the main problem.** The PM report says everything is in date and there are no open remedials. In fact:
  - the 2A EICR expired on 5 Jun 2026;
  - the 2A gas safety record expired on 13 Oct 2026, and the boiler has now failed with no hot water;
  - the 5C EICR is *Unsatisfactory*, with a C2 (no RCD on the kitchen sockets) that has been open since 2024, and the tenant reports the sockets tripping;
  - flats 1A and 3A have no certificates on file at all;
  - the compliance register is wrong for 2A gas and 5C remedials.
- **Sale risk:** the OM overstates the passing rent: 4B at GBP 52,000 against GBP 48,100 in the lease, giving a total of GBP 122,200 against GBP 118,300. It also says 4B has no break option (the lease has a tenant break on 31 Mar 2029), and it says all certificates are current. The buyer's surveyor (m13) has asked for exactly these documents. At the true rent the quoted 5.32% NIY is about 5.15%.
- **Leasing:** 5C has given notice to leave on 31 Jan 2027 (GBP 25,200 a year). 3A is still vacant and has a viewing enquiry. Once 5C leaves, two of the five units will be empty.
- **Other matters:**
  - a suspected bank-detail fraud (m15): do not pay;
  - the 2A deposit is GBP 150 over the five-week cap;
  - the Millbrook House budget does not add up, and its Section 20 statement is wrong (m10, m11).

## 2. KPIs (traced)

| Key | Value | Check | Sources |
|---|---|---|---|
| rent_demanded | GBP 29,575 | sum | lease-canal-4b p.2 "The annual rent is GBP 48,100, payable quarterly in advance." ×0.25 = 12,025; units.csv p.1 "canal-1a,…,1800,month," ×3 = 5,400; tenancy-canal-2a p.1 "The rent is GBP 1,950 per month…" ×3 = 5,850; tenancy-canal-5c p.1 "The rent is GBP 2,100 per month…" ×3 = 6,300. Matches PM p.1 "Rent demanded in the quarter: GBP 29,575" |
| rent_collected | GBP 27,625 | sum | PM p.1 "Rent demanded in the quarter: GBP 29,575" less PM p.1 "Arrears at 30 September 2026: GBP 1,950 (flat 2A, September rent)." Matches PM "Rent collected in the quarter: GBP 27,625" |
| collection_rate | **93.4%** | ratio | 27,625 / 29,575 (PM p.1). **PM states 100%** |
| arrears_q3 | GBP 1,950 | equal | PM p.1 "Arrears at 30 September 2026: GBP 1,950"; tenancy-canal-2a p.1 "The rent is GBP 1,950 per month" (one month) |
| arrears_now | **GBP 3,900** | equal | rent-roll p.1 "Ruth Adeyemi GBP 3,900 (September and October rent)"; tenancy-canal-2a p.1 GBP 1,950 ×2 |
| repairs_budget | GBP 6,000 | equal | PM p.2 "Annual budget 2026: GBP 6,000" |
| repairs_spent | GBP 5,250 | equal | PM p.2 "Spent 1 January to 30 September 2026: GBP 5,250" |
| repairs_pct | **87.5%** | ratio | 5,250 / 6,000 (PM p.2). **PM states 58%** |

Other figures:

- Passing rent is GBP 118,300 a year (rent-roll p.1 "Total passing rent: GBP 118,300"). This is 48,100 + 21,600 + 23,400 + 25,200.
- Occupancy is 4 of 5 units (PM p.1). From 1 Feb 2027 it will be 3 of 5, and the passing rent will fall to GBP 93,100.

## 3. Where the PM report is wrong

| # | PM report says | Sources say |
|---|---|---|
| 1 | p.1 "Rent collected in the quarter: GBP 27,625, which is 100% of rent demanded." | Its own figures give 27,625 / 29,575 = **93.4%**. p.1 also records "Arrears at 30 September 2026: GBP 1,950". |
| 2 | p.1 "Arrears at 30 September 2026: GBP 1,950 (flat 2A, September rent)." (Correct at the quarter date, but now out of date.) | rent-roll p.1 "Ruth Adeyemi GBP 3,900 (September and October rent)": arrears have doubled by 1 Nov. |
| 3 | p.2 "Spend is on track at 58% of the annual budget." | p.2 "Annual budget 2026: GBP 6,000" and "Spent 1 January to 30 September 2026: GBP 5,250" give **87.5%**, with Q4 still to come. |
| 4 | p.2 "All gas safety records and electrical reports are in date." | eicr-canal-2a p.1 "Next inspection recommended by: 5 June 2026": already expired at the start of the quarter. compliance.csv p.1 "canal-2a,eicr,2021-06-05,2026-06-05,eicr-canal-2a.pdf," shows the PM's own register had it as expired. |
| 5 | Same statement (p.2) | gas-safety-canal-2a p.1 "Next safety check due by: 13 October 2026": overdue since 14 Oct. m17 (inbox p.8) "our records show flat 2A is past its annual gas safety check." The register is wrong: compliance.csv "canal-2a,gas,2025-10-14,2027-10-13,…" (2027 instead of 2026). |
| 6 | p.2 "There are no open remedial items." | eicr-canal-5c p.1 "Overall assessment of the installation: Unsatisfactory" and "1. Socket circuits in the kitchen have no RCD protection. Code C2." The EICR also states "Remedial work for C1 or C2 must be done within 28 days of the inspection." (inspection 20 Aug 2024). The register says "none recorded". m14 (inbox p.5) "Every time I use the kettle and the microwave together the kitchen sockets go off." |
| 7 | Same statement (p.2) | gas-safety-canal-5c p.1: gas fire "Not to current standards, advised". |
| 8 | p.2 "All gas safety records and electrical reports are in date." | There is no gas record or EICR for flat 1A (let to J. Whitmore) or for 3A (vacant). The compliance register only has rows for canal-2a and canal-5c. units.csv "canal-1a,22 Canal Street,J. Whitmore,j.whitmore@example.net,1800,month," has no tenancy document. The building has "Gas central heating with combi boilers." (OM p.3). |
| 9 | p.1 "Flat 3A has been vacant since 1 May 2026." / p.2 "Market flat 3A." | Six months void and no marketing evidence. m19 (inbox p.10) is an unanswered viewing enquiry. 3A cannot lawfully be let until it has its gas record and EICR. |

What the PM report does not mention:

- the 5C notice (m18);
- the 2A boiler failure (m12);
- the overpaid 2A deposit (tenancy-canal-2a p.2 "The tenant pays a deposit of GBP 2,400 on signing." against a five-week cap of 1,950×12/52×5 = GBP 2,250);
- the fraudulent Flowfix bank-change request (m15).

## 4. Offering memorandum vs leases and rent roll (sale in progress; buyer's surveyor m13)

| OM says | Sources say |
|---|---|
| p.2 "4B Copperleaf Coffee Ltd Commercial GBP 52,000 31 March 2031" and "The rent for unit 4B reflects the 2026 rent review." | lease-canal-4b p.2 "The annual rent is GBP 48,100, payable quarterly in advance." The first review is 1 Apr 2027 (rent-roll p.1 "Next rent review, unit 4B: 1 April 2027 (CPI, floor 1%, cap 4%)."). |
| p.1 "Total contracted rent of GBP 122,200 per year." | rent-roll p.1 "Total passing rent: GBP 118,300", which is GBP 3,900 lower. |
| p.1 "This reflects a net initial yield of 5.32% after purchaser costs of 6.8%." | 118,300 / (2,150,000 × 1.068) = **5.15%**. |
| p.1 "Shop let to Copperleaf Coffee Ltd until 31 March 2031, with no break option." | lease-canal-4b p.1 "The tenant may break the lease on 31 March 2029 with six months notice." The rent roll also shows the break on 31 Mar 2029. |
| p.1 "All gas safety and electrical certificates are current." | The 2A EICR and gas record have expired, the 5C EICR is unsatisfactory, and 1A and 3A have no certificates. m13 (inbox p.4) asks: "Please upload the current gas safety records and electrical reports for every flat, and the lease for unit 4B." |

Uploading the lease and certificates without correcting the OM will expose the misstatements to the buyer and create misrepresentation risk.

## 5. Other items from the inbox and registers

- **m15 suspected fraud.** The sender's domain is `flowfix-payments.example`, but the registered contact is `jobs@flowfix.example` (contractors.csv). The mail asks for invoice FF-2291 (GBP 1,380.00) to be paid to a new IBAN. Do not change the bank details. Verify with Flowfix on the registered number, 020 7946 0811.
- **m16 4B review.** At CPI 3.1%, which is inside the 1%–4% collar, the rent would be 48,100 × 1.031 = about **GBP 49,591** a year. This is indicative only: the CPI figure used will be the one at the review date.
- **m21 noise.** The 1A tenant complains that the shop's coffee machine starts at 6am. The 4B lease (as supplied) has no hours clause. The PM should deal with it informally with Copperleaf.
- **m20 Allfix invoice AF-7781.** The invoice is for GBP 504.00 incl. VAT for Millbrook House gutters. It belongs to the Millbrook service charge and must not go against the Canal repairs budget. It is payable within 30 days, by about 10 Dec 2026, to the account already on file.
- **Millbrook House (Fernhill).**
  - The line items add up to GBP 60,070, but the budget shows "Total budget GBP 61,070", which is GBP 1,000 too high (m10 says the demand looks high).
  - The budget states "Roof repairs: Section 20 consultation is not required for these works." That cannot be right. GBP 18,000 × 10% gives GBP 1,800 per two-bed flat, well above the GBP 250 per leaseholder threshold, so consultation is required (m11).

## 6. Risks

1. **Safety and legal (high).**
   - 2A: expired gas record, expired EICR, and the boiler has failed while a child lives in the flat.
   - 5C: an open C2 electrical defect with active symptoms.
   - 1A: no certificates at all.

   This exposes the fund to enforcement and civil penalties (Gas Safety Regulations 1998; Electrical Safety Standards Regulations 2020) and may prevent possession notices from being served.
2. **Sale (high).** The OM overstates the rent by GBP 3,900 a year and omits the 2029 break. Its compliance statement is false.
3. **Income (medium).** Arrears are rising (GBP 3,900). 5C is leaving (GBP 25,200 a year) and 3A is still void (6+ months).
4. **Cost (medium).** Repairs will overrun, and remedial costs (boiler, RCD, certificates) are still to come.
5. **Payment fraud (high if paid).** The m15 request must not be paid.
6. **Deposit (low).** The 2A deposit is GBP 150 over the cap and must be refunded.

## 7. Actions

| # | Action | Owner | Deadline |
|---|---|---|---|
| A1 | Emergency boiler repair and overdue gas safety check, flat 2A (m12, m17) | Kestrel PM, with Warmline Heating | Today, 11 Nov 2026 (gas check no later than the 12 Nov slot) |
| A2 | New EICR for flat 2A | Kestrel PM, with Brightspark Electrical | Booked by 13 Nov; certificate by 25 Nov 2026 |
| A3 | Fix the 5C C2 fault (RCD on kitchen sockets) and investigate the tripping (m14); assess the 5C gas fire | Kestrel PM, with Brightspark and Warmline | Attend by 13 Nov; remedial certificate by 20 Nov 2026 |
| A4 | Gas records and EICRs for 1A and 3A; 1A tenancy agreement; correct the compliance register | Kestrel PM | 25 Nov 2026 |
| A5 | Reissue the Q3 report with corrected collection (93.4%), repairs (87.5%), compliance and arrears; give a Q4 repairs reforecast | Kestrel PM | 20 Nov 2026 |
| A6 | Chase the 2A arrears (GBP 3,900), separately from the repair; refund the GBP 150 excess deposit | Kestrel PM | Letter by 13 Nov; refund by 25 Nov 2026 |
| A7 | Do not pay on the m15 bank change; verify with Flowfix by phone on the registered number | Asset manager / fund accounts | Today, 11 Nov 2026 |
| A8 | Correct the OM (4B rent, total rent, NIY, 2029 break, compliance) before the data room upload | Asset manager, with Lydgate & Moss | 13 Nov 2026 |
| A9 | Reply to the buyer's surveyor (m13) via the vendor agent: lease now, certificates once current | Asset manager, via Lydgate & Moss | 16 Nov 2026 |
| A10 | Acknowledge the 5C notice (m18), confirm the end date and deposit process, plan re-letting | Kestrel PM | 17 Nov 2026 |
| A11 | Reply to the 3A enquiry (m19) and set the asking rent; no move-in until the certificates are done | Kestrel PM | 13 Nov 2026 |
| A12 | Reply to Copperleaf on the 2027 review (m16) and raise the 6am noise (m21) | Kestrel PM | 18 Nov 2026 |
| A13 | Millbrook: correct the budget total, run Section 20 before any roof works, answer m10/m11, code AF-7781 to Millbrook | Fernhill Block Management | 18 Nov 2026 (AF-7781 paid by 10 Dec 2026) |

### Draft mails (NOT sent)

Kestrel's email address is not in the sources, so it is shown as [Kestrel PM]; confirm it before sending.

**A1. To: [Kestrel PM]; cc service@warmline.example. Subject: URGENT – Flat 2A, 22 Canal Street: no hot water and overdue gas safety check**
> Hello,
> Ruth Adeyemi (flat 2A) reported on 9 November that the boiler shows a fault light and there has been no hot water since Saturday. She has a young child at home. The flat's gas safety record (WH-25-10-0417) expired on 13 October 2026.
> Please get Warmline to attend today to repair the boiler and complete the annual gas safety check in the same visit. If today is not possible, please take Warmline's Thursday 12 November slot (9am–1pm) and provide temporary heaters and hot-water arrangements until then. The landlord must give at least 24 hours' written notice except in an emergency, and this is an emergency.
> Please send me the new gas safety record and confirm that a copy has gone to the tenant within 28 days.
> Please also correct the compliance register, which shows the next 2A gas check as 2027-10-13 instead of 13 October 2026.
> Thank you, Joel (asset manager, Harbourline Property Fund I LP)

**A2. To: [Kestrel PM]; cc ops@brightspark.example. Subject: Flat 2A, 22 Canal Street: EICR expired 5 June 2026**
> Hello,
> The EICR for flat 2A recommended the next inspection by 5 June 2026. It has therefore been out of date since before Q3, although the Q3 report says all electrical reports are in date.
> Please book Brightspark Electrical for a new EICR by 13 November and send me the report by 25 November. Any C1/C2 items must be fixed within 28 days, and the tenant must receive a copy.
> Thanks, Joel

**A3. To: ops@brightspark.example; cc [Kestrel PM], service@warmline.example. Subject: Flat 5C, 22 Canal Street: open C2 (no RCD on kitchen sockets) – sockets now tripping**
> Hello,
> Your EICR of 20 August 2024 for flat 5C was Unsatisfactory: "Socket circuits in the kitchen have no RCD protection. Code C2." The remedial work should have been done within 28 days, and we have no record that it was.
> The tenant now reports that the kitchen sockets trip whenever the kettle and microwave are used together (four times this week). Please attend by 13 November to make the installation safe, fit RCD protection, fix the missing consumer unit label (C3), and issue written confirmation of the remedial work by 20 November.
> Warmline: the March 2026 record noted the lounge gas fire as "Not to current standards, advised". Please quote to service or remove it.
> Kestrel will arrange access with 24 hours' written notice.
> Regards, Joel

**A4. To: [Kestrel PM]. Subject: 22 Canal Street: missing certificates for flats 1A and 3A, missing 1A tenancy, register corrections**
> Hello,
> The compliance register only covers 2A and 5C. We hold no gas safety record or EICR for flat 1A (let to J. Whitmore) or flat 3A (vacant), and no tenancy agreement for 1A.
> Please send the current certificates, or book Warmline and Brightspark, so that both flats have valid certificates by 25 November.
> Please also send the 1A tenancy agreement and its deposit protection details, and correct the register: 2A gas next due 13 Oct 2026 (not 2027), and the 5C EICR remedial is C2 open (not "none recorded").
> Thanks, Joel

**A5. To: [Kestrel PM]. Subject: Q3 2026 report, 22 Canal Street: corrections needed**
> Hello,
> Please reissue the Q3 report by 20 November with these corrections:
> 1. Collection was GBP 27,625 of GBP 29,575, which is 93.4%, not 100%.
> 2. Repairs spend was GBP 5,250 of GBP 6,000, which is 87.5%, not 58%. Please give a Q4 reforecast, and make sure the Millbrook Allfix invoice AF-7781 is not charged here.
> 3. Compliance: the 2A EICR expired on 5 Jun 2026, the 2A gas record expired on 13 Oct 2026, the 5C EICR is Unsatisfactory with an open C2, and there are no certificates for 1A or 3A.
> 4. Arrears are GBP 3,900 at 1 November.
> 5. Note the 5C notice to leave on 31 January 2027.
> Thanks, Joel

**A6. To: [Kestrel PM]. Subject: Flat 2A: arrears GBP 3,900 and deposit over cap**
> Hello,
> Flat 2A owes GBP 3,900 (September and October). Please send the tenant a courteous arrears letter by 13 November with a payment-plan offer, and keep it separate from the boiler repair, which must not be delayed.
> Separately, the deposit of GBP 2,400 exceeds the five-week cap (GBP 2,250 at GBP 1,950 a month). Please refund the GBP 150 excess to the tenant by 25 November and update the TDP-48213 protection. Please do not offset it against the arrears without legal advice.
> Thanks, Joel

**A7. To: jobs@flowfix.example (registered contact; do NOT reply to accounts@flowfix-payments.example); cc fund accounts. Subject: Verification: bank detail change request for Flowfix Plumbing**
> Hello,
> On 9 November we received an email from accounts@flowfix-payments.example asking us to pay invoice FF-2291 (GBP 1,380.00) and all other open invoices to a new IBAN.
> This domain is not the one we hold for you. We will not change any bank details until we have confirmed the change by phone on your registered number, 020 7946 0811.
> Please call us, or confirm whether this request is genuine.
> Regards, Joel
>
> (Internal note to fund accounts: freeze any change to Flowfix's payee details, and do not pay FF-2291 to the new IBAN.)

**A8. To: deals@lydgatemoss.example. Subject: 22 Canal Street OM: corrections required before data room release**
> Hello,
> Before anything further goes to bidders, the OM must be corrected:
> - Unit 4B rent is GBP 48,100 a year under the lease, not GBP 52,000. There has been no 2026 review; the first CPI review is on 1 April 2027.
> - Total contracted rent is GBP 118,300, not GBP 122,200, which puts the NIY at GBP 2,150,000 and 6.8% costs at about 5.15%, not 5.32%.
> - The 4B lease has a tenant break on 31 March 2029 on six months' notice. The OM says there is no break option.
> - Not all certificates are current: the 2A EICR and gas record have expired, the 5C EICR is unsatisfactory (remedials in hand), and certificates for 1A and 3A are being obtained.
> - Flat 5C has given notice to leave on 31 January 2027.
> Please send a corrected OM and a disclosure note to everyone who has received the original, and hold the data room upload until we have signed it off.
> Regards, Joel

**A9. To: deals@lydgatemoss.example (for onward transmission to Tim Barker MRICS, tim.barker@hollins-survey.example). Subject: 22 Canal Street: data room request**
> Dear Mr Barker,
> Thank you for your request. The lease for unit 4B will be uploaded this week.
> Updated gas safety records and electrical reports for every flat are being renewed and will be uploaded by 25 November 2026, together with a corrected schedule of tenancies.
> Kind regards, Joel, for Harbourline Property Fund I LP

**A10. To: [Kestrel PM] (reply to leo.fischer@example.com). Subject: Flat 5C notice: acknowledgement**
> Dear Leo,
> Thank you for letting us know, and congratulations on the new job. We acknowledge your notice to end the tenancy of flat 5C, with your last day on 31 January 2027. We will confirm in writing that this date is valid under your tenancy.
> Your deposit of GBP 2,400 is protected with an approved scheme (reference TDP-51977). After the check-out inspection we will agree any deductions with you and return the deposit through the scheme, normally within 10 days of agreement.
> We will contact you about the check-out and about viewings, which we will arrange with at least 24 hours' notice.
> Kind regards, Kestrel Property Management on behalf of Harbourline Property Fund I LP
>
> (Internal note to Kestrel: start marketing 5C now, and update the rent roll and the buyer disclosure.)

**A11. To: [Kestrel PM] (reply to priya.n@example.org). Subject: Flat 3A, 22 Canal Street**
> Dear Priya,
> Thank you for your interest. Flat 3A is available. We will confirm the asking rent and offer viewing slots shortly.
> Kind regards, Kestrel Property Management
>
> (Internal note to Kestrel: set the asking rent with the AM by 13 November. No tenancy may start until the 3A gas record and EICR are in place and deposit protection is set up.)

**A12. To: [Kestrel PM] (for maja@copperleaf.example). Subject: Unit 4B: rent review 1 April 2027 and early opening**
> Dear Maja,
> Under the lease, the rent is reviewed on 1 April in line with CPI, with a floor of 1% and a cap of 4%. If CPI is 3.1% at the review date, the rent would rise from GBP 48,100 to about GBP 49,591 a year (GBP 12,397.78 a quarter). This is indicative only; the final figure will use the CPI figure at the review date.
> Separately, a resident upstairs has mentioned that the coffee machine starting at 6am can be heard in the flat. Could you look at whether the start-up could be moved later or the machine placed on anti-vibration mounts?
> Kind regards, Kestrel Property Management on behalf of Harbourline Property Fund I LP

**A13. To: service@fernhill.example. Subject: Millbrook House 2026 budget: total, Section 20 and invoice AF-7781**
> Hello,
> 1. The budget line items add up to GBP 60,070, but the budget shows a total of GBP 61,070. Please correct the total and the half-yearly demands, and send Ms Sato (flat 12) the breakdown she asked for.
> 2. The budget says Section 20 consultation is not required for the GBP 18,000 roof repairs. At 10% a two-bed flat would pay GBP 1,800 (7.5% gives GBP 1,350), well above the GBP 250 threshold. Please do not start the works until a full Section 20 consultation has been run, and reply to Mr Price (flat 7) accordingly.
> 3. Allfix invoice AF-7781 (GBP 504.00 incl. VAT, gutter clearing) is a Millbrook House cost. Please code it to the Millbrook service charge and pay it to the account on file within terms (by 10 December 2026).
> Please confirm all three by 18 November.
> Regards, Joel

## 8. Traceability

All figures and finding quotes are in `am-update.json`, and every quote was checked with `check/trace_check.py` (0 rejected). The checker flags three PM-report figures that do not match the sources: collection rate (100% vs 93.4%), arrears at 1 Nov (GBP 1,950 vs 3,900) and repairs share (58% vs 87.5%).
