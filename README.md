# WasteVoice AI ♻️

## AI-Assisted Campus Waste Reporting and Resolution Tracking System

WasteVoice AI is an AI-assisted web application designed to improve the reporting and tracking of unmanaged waste in a campus environment.

The system helps transform a waste observation into a structured report and supports the complete workflow from reporting to human-verified resolution.

---

## 🎯 Core Problem

Unmanaged waste may remain unreported or its resolution process may not be clearly visible to the people who observe it.

WasteVoice AI aims to improve:

* Waste reporting accessibility
* Structured issue information
* Visibility of reported issues
* Action tracking
* Before-and-after evidence collection
* Accountability in the resolution workflow

---

## 🔄 Core Workflow

```text
Waste Observed
      ↓
Report Created
      ↓
AI-Assisted Report Structuring
      ↓
User Confirmation
      ↓
Submitted
      ↓
Authority Review
      ↓
Staff Assignment
      ↓
Cleaning In Progress
      ↓
After-Cleaning Evidence
      ↓
Authority Verification
      ↓
Resolved
```

---

## 👥 User Roles

### 👤 Reporter

The reporter can:

* Create a waste report
* Enter a location
* Describe the waste issue
* Upload before-cleaning evidence
* Review AI-generated suggestions
* Confirm or edit report information
* Track report status

### 🏛️ Authority

The authority can:

* Review submitted reports
* View before-cleaning evidence
* Update report status
* Assign cleaning staff
* Review after-cleaning evidence
* Verify completion
* Resolve or reopen reports

### 🧹 Cleaning Staff

Cleaning staff can:

* View assigned waste reports
* View task details and location
* Start cleaning work
* Update work status
* Upload after-cleaning evidence
* Mark cleaning work as completed

The final **Resolved** status is controlled by the authority after verification.

---

## 🤖 AI Component

The AI component assists with understanding and structuring the reporter's natural-language description.

AI may suggest:

* Waste category
* Location information when supported by the user's input
* A concise structured report summary

All AI-generated information is reviewed and can be corrected by the reporter before submission.

### Human-in-the-Loop

WasteVoice AI does not allow AI to independently:

* Dispatch cleaning staff
* Mark cleaning work as complete
* Mark reports as resolved

Human users remain responsible for real-world actions and final verification.

---

## 🖼️ Evidence-Based Verification

WasteVoice AI supports a before-and-after evidence workflow.

**Before Evidence**

Uploaded by the reporter when the waste issue is reported.

**After Evidence**

Uploaded by cleaning staff after completing the cleaning work.

**Authority Verification**

The authority reviews the before and after evidence and decides whether to:

* Resolve the report
* Reopen the report
* Request further action

---

## 🛠️ Planned Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend and Database

* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Storage

### AI

An AI language-processing component will be integrated to structure natural-language waste reports.

The exact AI provider and model will be documented after implementation.

---

## 📊 Project Status

🚧 **Currently in active development**

Current phase:

> **Phase 0 — Repository and Project Foundation**

---

## 🗺️ Development Roadmap

* [x] Define the problem and project workflow
* [x] Define user roles
* [x] Define the evidence-based resolution workflow
* [x] Create public GitHub repository
* [ ] Initialize React + TypeScript + Vite application
* [ ] Configure Tailwind CSS
* [ ] Configure Supabase
* [ ] Implement authentication and roles
* [ ] Build reporter workflow
* [ ] Implement before evidence upload
* [ ] Implement AI-assisted report structuring
* [ ] Build authority workflow
* [ ] Implement cleaning staff workflow
* [ ] Implement after evidence upload
* [ ] Implement authority verification
* [ ] Testing and validation
* [ ] Complete Review 1 documentation

---

## 📌 Current Workflow Status

```text
Repository Setup        ██████████  Complete
Application Foundation  ░░░░░░░░░░  Not Started
Database Setup          ░░░░░░░░░░  Not Started
Authentication          ░░░░░░░░░░  Not Started
Reporter Workflow       ░░░░░░░░░░  Not Started
AI Integration          ░░░░░░░░░░  Not Started
Authority Workflow      ░░░░░░░░░░  Not Started
Staff Workflow          ░░░░░░░░░░  Not Started
Verification Workflow   ░░░░░░░░░░  Not Started
Testing                 ░░░░░░░░░░  Not Started
```

---

## 🔐 Project Principle

WasteVoice AI follows the principle:

> **AI assists humans; humans make the final decisions.**

The project prioritizes a transparent and accountable workflow:

**Report → Review → Assign → Clean → Evidence → Verify → Resolve**

---

## 📚 Project

**Project:** Better Tomorrow
**Batch:** C29
**Semester:** 3
**Project Type:** AI-Assisted Software Project

---

## 🚧 Development Note

This repository is under active development. Features listed as planned or in progress should not be interpreted as completed functionality.
