# Demo Workflow Guide: Smart Lead Qualification System

## Overview
This workflow demonstrates a **real-world business automation** that showcases all the powerful features of your n8n-clone platform.

**Use Case**: Automatically qualify incoming sales leads, score them with AI, and route high-value leads to sales team while tracking others.

**Why This Impresses**:
- ✅ Shows API integration (HTTP Request)
- ✅ Demonstrates AI capabilities (GPT)
- ✅ Uses conditional logic (branching)
- ✅ Multiple output channels (Email + Sheets)
- ✅ Real business value
- ✅ Professional workflow design

---

## Workflow Architecture

```
Webhook Trigger
      ↓
HTTP Request (Enrich lead data from Clearbit)
      ↓
GPT Analysis (Score lead quality 1-10)
      ↓
Condition (Score >= 7?)
   ├─ TRUE → Gmail (Alert sales team immediately)
   └─ FALSE → Google Sheets (Add to nurture list)
```

---

## Step-by-Step Creation Guide

### 1. Create New Workflow
1. Go to http://localhost:3000
2. Login: `demo@n8n-clone.com` / `demo123`
3. Navigate to "Workflows"
4. Click "Create Workflow"
5. Name it: **"Smart Lead Qualification System"**

### 2. Add Webhook Trigger Node

**Position**: (100, 100)

**Configuration**:
- **Type**: Webhook
- **Name**: New Lead Received
- **Path**: `/webhook/new-lead`

**What it does**: Receives POST requests with lead data
```json
{
  "email": "john@company.com",
  "name": "John Doe",
  "company": "Acme Corp",
  "source": "website-form"
}
```

### 3. Add HTTP Request Node (Data Enrichment)

**Position**: (300, 100)

**Configuration**:
- **Type**: HTTP Request
- **Name**: Enrich Lead Data
- **URL**: `https://person.clearbit.com/v2/combined/find?email={{webhook.email}}`
- **Method**: GET
- **Headers**: 
  ```
  Authorization: Bearer YOUR_CLEARBIT_KEY
  ```

**What it does**: Enriches lead with company size, industry, employee count

**Demo Note**: Since we don't have real Clearbit key, mock the response in config:
```json
{
  "person": {
    "name": "{{webhook.name}}",
    "employment": {
      "title": "CTO",
      "seniority": "executive"
    }
  },
  "company": {
    "name": "{{webhook.company}}",
    "employees": 250,
    "industry": "Technology"
  }
}
```

### 4. Add GPT Node (AI Scoring)

**Position**: (500, 100)

**Configuration**:
- **Type**: GPT
- **Name**: AI Lead Scorer
- **Model**: gpt-4
- **Prompt**:
  ```
  Analyze this lead and score from 1-10 based on qualification:
  
  Name: {{webhook.name}}
  Email: {{webhook.email}}
  Company: {{http-request.company.name}}
  Employees: {{http-request.company.employees}}
  Industry: {{http-request.company.industry}}
  Title: {{http-request.person.employment.title}}
  Seniority: {{http-request.person.employment.seniority}}
  
  Return ONLY a number 1-10 representing lead quality.
  Executive at 100+ employee tech company = 9-10
  Manager at 50+ employees = 6-8
  Individual contributor or small company = 1-5
  ```

**What it does**: Uses AI to intelligently score lead quality

### 5. Add Condition Node (Router)

**Position**: (700, 100)

**Configuration**:
- **Type**: Condition
- **Name**: High Value Check
- **Left Value**: `{{gpt.score}}`
- **Operator**: `greaterThanOrEqual`
- **Right Value**: `7`

**What it does**: Routes high-value leads (≥7) to immediate action

### 6. Add Gmail Node (Hot Lead Alert)

**Position**: (900, 50)
**Connected to**: Condition TRUE output

**Configuration**:
- **Type**: Gmail
- **Name**: Alert Sales Team
- **To**: `sales@yourcompany.com`
- **Subject**: `🔥 Hot Lead: {{webhook.name}} from {{http-request.company.name}}`
- **Body**:
  ```
  High-value lead detected!
  
  Contact: {{webhook.name}}
  Email: {{webhook.email}}
  Company: {{http-request.company.name}}
  Size: {{http-request.company.employees}} employees
  Title: {{http-request.person.employment.title}}
  
  AI Score: {{gpt.score}}/10
  
  Action Required: Reach out within 24 hours
  ```

**What it does**: Immediately notifies sales of hot leads

### 7. Add Google Sheets Node (Nurture List)

**Position**: (900, 150)
**Connected to**: Condition FALSE output

**Configuration**:
- **Type**: Google Sheets
- **Name**: Add to Nurture List
- **Spreadsheet**: "Lead Nurture Pipeline"
- **Operation**: Append Row
- **Data**:
  ```
  Name: {{webhook.name}}
  Email: {{webhook.email}}
  Company: {{http-request.company.name}}
  Score: {{gpt.score}}
  Date: {{$now}}
  Status: Nurturing
  ```

**What it does**: Tracks lower-priority leads for nurture campaigns

---

## Execution Test Data

Test your workflow with this sample payload:

**High-Value Lead** (Should go to Gmail):
```json
{
  "email": "sarah.johnson@techcorp.com",
  "name": "Sarah Johnson",
  "company": "TechCorp Industries",
  "source": "linkedin"
}
```

**Low-Value Lead** (Should go to Sheets):
```json
{
  "email": "john@smallbiz.com",
  "name": "John Smith",
  "company": "Small Business LLC",
  "source": "website"
}
```

---

## Visual Layout

Arrange nodes like this for professional appearance:

```
         [Webhook]
             ↓
      [HTTP Request]
             ↓
          [GPT]
             ↓
        [Condition]
          /     \
         /       \
    [Gmail]   [Sheets]
   (Score≥7) (Score<7)
```

Use these colors for visual impact:
- Triggers: Blue
- Actions: Purple
- Logic: Orange
- AI: Green

---

## Screenshot Tips for LinkedIn

1. **Canvas View**: Show the complete workflow with all nodes connected
2. **Execution View**: Run the workflow and show successful execution
3. **Results View**: Show the execution logs with processing times
4. **Dashboard**: Show statistics (workflows created, executions run)

---

## Talking Points for LinkedIn Post

Use these when showcasing:

**Technical Excellence**:
- "Built with Next.js 15, TypeScript, and tRPC for end-to-end type safety"
- "Visual workflow builder powered by React Flow"
- "Real-time execution monitoring with comprehensive logging"

**Features Demonstrated**:
- "AI-powered lead qualification using GPT"
- "Conditional routing based on business logic"
- "Multi-channel automation (Email + Sheets)"
- "Webhook-triggered workflows"

**Business Value**:
- "Automates lead qualification, saving 10+ hours/week"
- "Ensures no high-value lead is missed"
- "Reduces response time from hours to seconds"

---

## Alternative Demo Workflows

### Option 2: Content Moderation Pipeline
```
Webhook → GPT (Analyze content) → Condition → 
  ├─ Approved → Google Sheets
  └─ Flagged → Gmail (Alert moderators)
```

### Option 3: Daily Report Automation
```
Schedule (9 AM daily) → HTTP (Fetch analytics) → 
GPT (Summarize insights) → Gmail (Send report)
```

### Option 4: Customer Support Triage
```
Webhook → GPT (Classify urgency) → Condition →
  ├─ Urgent → Gmail (Route to manager)
  ├─ Medium → Sheets (Add to support queue)
  └─ Low → HTTP (Create ticket)
```

---

## Pro Tips

1. **Use realistic data**: Makes demo more relatable
2. **Show execution logs**: Proves it actually works
3. **Demonstrate error handling**: Show retry mechanism
4. **Highlight type safety**: Show autocomplete in variable refs
5. **Explain business impact**: Connect to real ROI

---

## What Makes This Credible

✅ **Real-world use case** - Not a toy example
✅ **Multiple integrations** - Shows platform capability
✅ **AI/ML integration** - Modern, cutting-edge
✅ **Business logic** - Conditional routing
✅ **Professional UI** - Clean, intuitive interface
✅ **Production-ready** - Error handling, logging, retries

---

## After Creating the Workflow

1. **Execute it** - Show it running successfully
2. **Check logs** - Display execution timeline
3. **Take screenshots** - Professional, high-quality
4. **Record video** - 30-second demo for LinkedIn
5. **Write post** - Highlight technical achievements

---

**This workflow demonstrates enterprise-grade automation in your portfolio project!** 🚀
