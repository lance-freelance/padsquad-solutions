# Business Days Calculation Reference

> **Instructions**: Edit the `BD Offset` values and milestone labels below to reflect the correct logic for each scenario. Once you're done, give this document back and I'll update the code to match.
>
> - **BD Offset** = number of business days after kick-off (day 0)
> - **Client Action** = milestone where the client must take action (review, approve, provide feedback)
> - Weekends and US federal holidays are automatically skipped

---

## Scenario 1: PadSquad Designs — No Assets

**Description**: PadSquad creates the creative design. Assets have NOT been received yet.
**Total Business Days**: **21**

| # | Milestone | BD Offset | Client Action |
|---|-----------|-----------|---------------|
| 1 | Assets received | 0 | No |
| 2 | Creative development | 1 | No |
| 3 | Creative review R1 | 2 | Yes |
| 4 | Creative feedback due | 3 | Yes |
| 5 | Creative feedback implemented | 4 | No |
| 6 | Creative review R2 | 7 | Yes |
| 7 | Creative approval | 8 | Yes |
| 8 | Demo development | 10 | No |
| 9 | Demo review R1 | 11 | Yes |
| 10 | Demo feedback due | 15 | Yes |
| 11 | Demo feedback implemented | 16 | No |
| 12 | Demo review R2 | 17 | Yes |
| 13 | Client approval | 18 | Yes |
| 14 | QA & trafficking | 20 | No |
| 15 | Campaign launch | 21 | No |

---

## Scenario 2: PadSquad Designs — Assets In Hand

**Description**: PadSquad creates the creative design. Assets have already been received.
**Total Business Days**: **12**

| # | Milestone | BD Offset | Client Action |
|---|-----------|-----------|---------------|
| 1 | Assets received | 0 | No |
| 2 | Creative layout sent | 2 | No |
| 3 | Creative feedback due | 3 | Yes |
| 4 | Creative revisions sent | 4 | No |
| 5 | Creative approval | 5 | Yes |
| 6 | Demo development | 6 | No |
| 7 | Demo review R1 | 7 | Yes |
| 8 | Demo feedback due | 8 | Yes |
| 9 | Demo feedback implemented | 9 | No |
| 10 | Client approval | 10 | Yes |
| 11 | QA & trafficking | 11 | No |
| 12 | Campaign launch | 12 | No |

---

## Scenario 3: Client Designs — No Assets

**Description**: Client provides pre-approved design files. Assets have NOT been received yet.
**Total Business Days**: **13**

| # | Milestone | BD Offset | Client Action |
|---|-----------|-----------|---------------|
| 1 | Design files received | 0 | No |
| 2 | Demo development | 2 | No |
| 3 | Demo review R1 | 3 | Yes |
| 4 | Demo feedback due | 7 | Yes |
| 5 | Demo feedback implemented | 8 | No |
| 6 | Demo review R2 | 9 | Yes |
| 7 | Client approval | 10 | Yes |
| 8 | QA & trafficking | 12 | No |
| 9 | Campaign launch | 13 | No |

---

## Scenario 4: Client Designs — Assets In Hand

**Description**: Client provides pre-approved design files. Assets have already been received.
**Total Business Days**: **8**

| # | Milestone | BD Offset | Client Action |
|---|-----------|-----------|---------------|
| 1 | Design files & assets received | 0 | No |
| 2 | Demo development | 1 | No |
| 3 | Demo review R1 | 2 | Yes |
| 4 | Demo feedback due | 3 | Yes |
| 5 | Demo feedback implemented | 4 | No |
| 6 | Client approval | 5 | Yes |
| 7 | QA & trafficking | 7 | No |
| 8 | Campaign launch | 8 | No |

---

## How to Edit

1. **Change a BD Offset**: Update the number in the `BD Offset` column
2. **Add a milestone**: Add a new row to the table (keep them in chronological order)
3. **Remove a milestone**: Delete the row
4. **Rename a milestone**: Change the text in the `Milestone` column
5. **Change client action**: Switch `Yes`/`No` in the `Client Action` column
6. **Change total business days**: Update the **Total Business Days** value (should match the last milestone's BD Offset)

Once you've made your edits, share this document back and I'll update the code in `milestones.js` to match your changes exactly.
