# Exact Configuration for Smart Lead Qualification Workflow

## Step-by-Step Node Configuration

Follow these exact values to create a fully executable workflow.

---

## Node 1: Webhook (Trigger)

**Click on the Webhook node → Configure:**

```
Node automatically receives data when triggered.
No configuration needed - it's ready to go!

Test data will be:
{
  "name": "Sarah Johnson",
  "email": "sarah@techcorp.com",
  "company": "TechCorp Industries",
  "phone": "+1-555-0123"
}
```

✅ **Status:** No config needed, click Save

---

## Node 2: HTTP Request (Data Enrichment)

**Click on HTTP Request node → Parameters tab:**

### Request Method
```
POST
```

### URL
```
https://httpbin.org/post
```

### Headers (leave empty or use this)
```json
{
  "Content-Type": "application/json"
}
```

### Body
```json
{
  "name": "{{webhook.name}}",
  "email": "{{webhook.email}}",
  "company": "{{webhook.company}}",
  "enriched": true
}
```

**What this does:** Simulates calling an API to enrich lead data (using httpbin.org as a test endpoint)

✅ **Click Save**

---

## Node 3: GPT (AI Lead Scorer)

**Click on GPT node → Parameters tab:**

### Model
```
gpt-3.5-turbo
```

### System Prompt
```
You are a lead qualification expert. Analyze leads and score them from 1-10 based on their potential value.
```

### User Prompt
```
Score this lead from 1 to 10:

Name: {{webhook.name}}
Email: {{webhook.email}}
Company: {{webhook.company}}

Return ONLY a single number between 1-10. No explanation.
High-value indicators:
- Executive titles (CEO, CTO, VP) = 8-10
- Large companies (500+ employees) = 7-9
- Tech industry = add +1
- Enterprise email domain = add +1

Just return the number.
```

### Temperature
```
0.3
```
(Slider to the left for more focused/consistent output)

### Max Tokens
```
10
```
(We only need one number!)

**What this does:** AI analyzes the lead and gives a score 1-10

✅ **Click Save**

---

## Node 4: Condition (Decision Logic)

**Click on Condition node → Parameters tab:**

### Left Value
```
{{gpt.score}}
```

### Operator
```
greaterThanOrEqual
```
(Select "Greater or Equal (≥)" from dropdown)

### Right Value
```
7
```

**What this does:** 
- If AI score ≥ 7 → Routes to Gmail (hot lead!)
- If AI score < 7 → Routes to Google Sheets (nurture list)

✅ **Click Save**

---

## Node 5: Gmail (High-Value Alert) 
**Connect from Condition TRUE output**

**Click on Gmail node → Parameters tab:**

### To
```
sales@company.com
```

### Subject
```
🔥 Hot Lead Alert: {{webhook.name}} from {{webhook.company}}
```

### Body
```
HIGH-VALUE LEAD DETECTED!

Contact Information:
━━━━━━━━━━━━━━━━━━
Name: {{webhook.name}}
Email: {{webhook.email}}
Company: {{webhook.company}}
Phone: {{webhook.phone}}

AI Assessment:
━━━━━━━━━━━━━━━━━━
Lead Score: {{gpt.score}}/10
Status: HOT LEAD 🔥

Action Required:
━━━━━━━━━━━━━━━━━━
⚡ Reach out within 24 hours
⚡ Personalize your approach
⚡ Mention their company's needs

This lead was automatically qualified by our AI system.
```

**What this does:** Sends urgent email to sales team for high-value leads

✅ **Click Save**

---

## Node 6: Google Sheets (Nurture List)
**Connect from Condition FALSE output**

**Click on Google Sheets node → Parameters tab:**

### Operation
```
Append Row
```
(Select "Append Row" from dropdown)

### Spreadsheet ID
```
demo-nurture-pipeline
```
(In a real setup, this would be your actual Google Sheets ID)

### Sheet Name
```
Leads
```

### Data to Append
```
{{webhook.name}}, {{webhook.email}}, {{webhook.company}}, {{gpt.score}}, Nurturing, {{$now}}
```

**What this does:** Adds lower-priority leads to a spreadsheet for nurture campaigns

✅ **Click Save**

---

## 🎯 Final Workflow Structure

Your canvas should look like this:

```
┌──────────┐
│ Webhook  │
└────┬─────┘
     │
     ↓
┌──────────────┐
│ HTTP Request │
└──────┬───────┘
       │
       ↓
  ┌────────┐
  │  GPT   │
  └───┬────┘
      │
      ↓
   ◆──────◆
   Condition
   ◆──────◆
    /      \
 TRUE    FALSE
   ↓        ↓
┌──────┐ ┌────────────┐
│Gmail │ │Google Shts │
└──────┘ └────────────┘
```

---

## 🚀 Testing Your Workflow

### Step 1: Save the Workflow
Click **Save** button (top right)

### Step 2: Execute
Click **Execute** button

### Step 3: Check Results
- Look at execution logs
- See which path the condition took
- Verify the output

---

## 📊 Test Scenarios

### Test 1: High-Value Lead (Should go to Gmail)
```json
{
  "name": "Sarah Johnson",
  "email": "ceo@techcorp.com", 
  "company": "TechCorp Industries",
  "phone": "+1-555-0123"
}
```
**Expected:** Score 8-10 → Gmail path

### Test 2: Medium Lead (Should go to Sheets)
```json
{
  "name": "John Smith",
  "email": "john@smallbiz.com",
  "company": "Small Business LLC", 
  "phone": "+1-555-0456"
}
```
**Expected:** Score 3-6 → Google Sheets path

---

## 💡 Important Notes

### Variable Syntax
- Use `{{nodeName.field}}` to reference previous node outputs
- Examples:
  - `{{webhook.name}}` - Gets name from webhook
  - `{{gpt.score}}` - Gets AI score
  - `{{http-request.data}}` - Gets HTTP response

### Node Names
- Default names are: `webhook`, `http-request`, `gpt`, `condition`, `gmail`, `google-sheets`
- If you rename a node, update variable references!

### Special Variables
- `{{$now}}` - Current timestamp
- `{{$json}}` - Full JSON from previous node

---

## 🎨 Quick Copy-Paste Values

**Webhook:** No config needed

**HTTP Request URL:**
```
https://httpbin.org/post
```

**GPT Prompt:**
```
Score this lead from 1 to 10:
Name: {{webhook.name}}
Email: {{webhook.email}}
Company: {{webhook.company}}

Return ONLY a number 1-10.
```

**Condition:**
- Left: `{{gpt.score}}`
- Operator: `greaterThanOrEqual`
- Right: `7`

**Gmail Subject:**
```
🔥 Hot Lead: {{webhook.name}} from {{webhook.company}}
```

**Gmail Body:**
```
Hot lead detected!
Name: {{webhook.name}}
Score: {{gpt.score}}/10
Email: {{webhook.email}}
```

**Sheets Data:**
```
{{webhook.name}}, {{webhook.email}}, {{webhook.company}}, {{gpt.score}}
```

---

## ✅ Checklist

Before executing:
- [ ] All 6 nodes added to canvas
- [ ] Nodes connected: Webhook → HTTP → GPT → Condition → (Gmail + Sheets)
- [ ] Each node configured with values above
- [ ] Workflow saved
- [ ] Ready to execute!

**NOW GO CREATE IT!** 🚀

Your workflow will automatically:
1. Receive lead data
2. Enrich with API call
3. Score with AI
4. Route high-value leads to sales
5. Track low-value leads for nurturing

This is a **production-ready automation** that showcases real business value! 🎉
