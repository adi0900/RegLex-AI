# Example JSON Export Structure

This document shows the structure of the JSON data exported from the SEBI Compliance Dashboard.

## JSON Schema

The exported JSON follows this structure:

```json
{
  "summary": "string - Overall document summary",
  "timelines": {
    "loan_repayment_period": {
      "start": "string - Start date or condition",
      "end": "string - End date or condition",
      "description": "string - Description of the timeline"
    }
    // Additional timelines...
  },
  "clauses": [
    {
      "clause_id": "string - Unique identifier",
      "text_en": "string - Clause text in English"
    }
    // Additional clauses...
  ],
  "compliance_results": {
    "verification_results": [
      {
        "clause": {
          "clause_id": "string - Reference to clause ID",
          "text_en": "string - Clause text"
        },
        "is_compliant": "boolean|null - Compliance status",
        "matched_rules": "array - Matched SEBI rules",
        "final_reason": "string - Explanation for compliance determination",
        "Section": "string - Relevant section"
      }
      // Additional verification results...
    ],
    "risk_explanations": [
      {
        "severity": "string - Risk severity level",
        "category": "string - Risk category",
        "risk_score": "number - Numerical risk score",
        "impact": "string - Description of potential impact",
        "mitigation": "string - Suggested mitigation steps"
      }
      // Additional risk explanations...
    ]
  },
  "metadata": {
    "exportDate": "string - ISO date of export",
    "exportedBy": "string - System that generated export",
    "documentName": "string - Name of the document analyzed"
  }
}
```

## Sample Data

Here's a sample of what the actual JSON export looks like:

```json
{
  "summary": "This document details the terms and conditions for a Personal Power Loan agreement between Axis Bank Ltd. and the applicant, POYYAR DASS S, operating from ASC Madurai. The loan amount sanctioned is Rs. 20,00,000, with a fixed annual interest rate of 10.49%. The repayment tenure is set for 84 months, with Equated Monthly Installments (EMIs) amounting to Rs. 33,711.",
  "timelines": {
    "loan_repayment_period": {
      "start": "Date of Agreement/Disbursal",
      "end": "84 months from start",
      "description": "The period over which the Personal Power Loan of Rs. 20,00,000 is to be repaid in 84 monthly installments."
    },
    "foreclosure_charges_initial_period": {
      "start": "Loan A/c opening Date",
      "end": "Up to 36 EMIs from Loan A/c opening Date",
      "description": "Foreclosure charges of 3% + GST are applicable on the principal outstanding."
    }
  },
  "clauses": [
    {
      "clause_id": "C-1",
      "text_en": "I/We have been provided the following information and I/We have read and understood the following information and agree with the same and have accordingly filled up the aforesaid application form."
    },
    {
      "clause_id": "C-2",
      "text_en": "Interest on the Personal Power loan shall accrue from the date on which the disbursal has been effected in the loan account and accordingly the computation of the first EMI shall be calculated only for the actual number of days remaining for the due date of first installment."
    }
  ],
  "compliance_results": {
    "verification_results": [
      {
        "clause": {
          "clause_id": "C-1",
          "text_en": "I/We have been provided the following information and I/We have read and understood the following information and agree with the same and have accordingly filled up the aforesaid application form."
        },
        "is_compliant": null,
        "matched_rules": [],
        "final_reason": "Compliance cannot be determined as no specific regulatory rules were provided for comparison.",
        "Section": "Compliance"
      },
      {
        "clause": {
          "clause_id": "C-2",
          "text_en": "Interest on the Personal Power loan shall accrue from the date on which the disbursal has been effected in the loan account and accordingly the computation of the first EMI shall be calculated only for the actual number of days remaining for the due date of first installment."
        },
        "is_compliant": false,
        "matched_rules": [],
        "final_reason": "Compliance verification for the clause could not be performed due to incomplete rule data.",
        "Section": "Banking"
      }
    ],
    "risk_explanations": [
      {
        "severity": "Medium",
        "category": "General",
        "risk_score": 5,
        "impact": "Unclassified risk detected.",
        "mitigation": "Manual review recommended."
      },
      {
        "severity": "Medium",
        "category": "General",
        "risk_score": 5,
        "impact": "Unclassified risk detected.",
        "mitigation": "Manual review recommended."
      }
    ]
  },
  "metadata": {
    "exportDate": "2024-01-15T10:30:00Z",
    "exportedBy": "SEBI Compliance Dashboard",
    "documentName": "Personal Power Loan Agreement - POYYAR DASS S"
  }
}
```

## Using the JSON Data

To work with the exported JSON data:

1. **Parse the JSON**: Use your preferred programming language's JSON parsing capabilities
2. **Analyze Compliance Results**: Examine the `verification_results` array for compliance determinations
3. **Review Risk Assessments**: Check the `risk_explanations` for potential issues
4. **Extract Clauses**: Access individual clauses through the `clauses` array
5. **Reference Metadata**: Use the `metadata` object for contextual information

Example Python code to parse the JSON:

```python
import json

# Load the exported JSON file
with open('compliance_export.json', 'r') as f:
    data = json.load(f)

# Access different parts of the data
summary = data['summary']
clauses = data['clauses']
verification_results = data['compliance_results']['verification_results']
risk_explanations = data['compliance_results']['risk_explanations']

# Print some information
print(f"Document Summary: {summary}")
print(f"Total Clauses: {len(clauses)}")
print(f"Compliance Results: {len(verification_results)} items")

# Iterate through verification results
for result in verification_results:
    clause_text = result['clause']['text_en']
    is_compliant = result['is_compliant']
    reason = result['final_reason']
    print(f"Clause: {clause_text[:50]}...")
    print(f"Compliant: {is_compliant}")
    print(f"Reason: {reason}\n")
```