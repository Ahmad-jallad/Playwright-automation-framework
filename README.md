# Playwright Automation Assessment - Web & API Framework

## Overview

End-to-end test automation framework for the **QA Automation Engineer Technical Assessment** built with **Playwright** and **TypeScript**. The framework follows the **Page Object Model (POM)** design pattern and covers UI testing for **SauceDemo** and API testing for **Simple Books API**.

**UI Base URL:** `https://www.saucedemo.com/`  
**API Base URL:** `https://simple-books-api.click`  
**Browsers:** Google Chrome and Mozilla Firefox  
**Language:** TypeScript  
**Test Runner:** Playwright Test

---

## Table of Contents

- [Project Description](#project-description)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
  - [BasePage](#basepage)
  - [Page Objects](#page-objects)
  - [Fixtures](#fixtures)
  - [API Layer](#api-layer)
  - [Utilities](#utilities)
- [Test Scenarios](#test-scenarios)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [GitHub Actions](#github-actions)

---

## Project Description

This repository contains a clean Playwright automation framework that validates core web flows on SauceDemo and API order flows on Simple Books API. It uses POM, external JSON test data, custom fixtures, dynamic test data utilities, and Playwright HTML reporting.

---

## Prerequisites

| Tool    | Required Version | Notes |
|---------|------------------|-------|
| Node.js | `v22.x` or higher | Recommended LTS version |
| npm     | `v10.x` or higher | Installed with Node.js |

Check your installed versions:

```bash
node -v
npm -v
```

---

## Project Structure

```
playwright-automation/
├── src/
│   ├── pages/                         # Page Object Model classes for UI pages
│   │   ├── BasePage.ts                # Shared reusable page methods
│   │   ├── LoginPage.ts               # SauceDemo login page locators/actions
│   │   ├── ProductsPage.ts            # Products page and product-selection logic
│   │   ├── CartPage.ts                # Cart page actions and assertions
│   │   └── CheckoutPage.ts            # Checkout information, overview, and completion page
│   │
│   ├── api/                           # API service layer
│   │   └── simpleBooksApi.ts          # Token generation, order creation, and order fetching
│   │
│   └── utils/                         # Reusable utilities
│       └── random.util.ts             # Random strings, emails, and numbers
│
├── tests/
│   ├── fixtures/                      # Custom Playwright fixtures
│   │   └── pages.fixture.ts           # Auto-injects Page Objects into UI tests
│   │
│   ├── ui/                            # SauceDemo UI test specs
│   │   ├── login.spec.ts              # Valid and invalid login scenarios
│   │   └── checkout.spec.ts           # End-to-end checkout flow
│   │
│   └── api/                           # Simple Books API test specs
│       └── orders.spec.ts             # Create and fetch book order scenarios
│
├── test-data/                         # External JSON test data
│   ├── ui-test-data.json              # UI users, errors, and checkout data
│   └── api-test-data.json             # API base URL, book ID, and customer name
│
├── reports/                           # JSON report output folder
├── playwright.config.ts               # Playwright configuration
├── global-setup.ts                    # Logs when the test suite starts
├── global-teardown.ts                 # Logs when the test suite finishes
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── .gitignore                         # Ignored files and folders
└── README.md                          # Project documentation
```

---

## Setup & Installation

### 1. Clone Repository

```bash
git clone <your-public-github-repository-url>
cd playwright-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

For CI/Linux environments, install browser dependencies as well:

```bash
npx playwright install --with-deps
```

---

## Configuration

### Playwright Config (`playwright.config.ts`)

| Setting            | Value |
|--------------------|-------|
| Test Directory     | `./tests` |
| Browser Projects   | Google Chrome, Mozilla Firefox |
| Headless           | `true` |
| Viewport           | `null` |
| Window Mode        | Maximized using `--start-maximized` |
| Retries            | `0` locally, `2` on CI |
| Screenshots        | On failure only |
| Video              | Retain on failure |
| Trace              | On first retry |
| Reporter           | HTML, JSON, List |
| Global Setup       | Prints test suite start log |
| Global Teardown    | Prints test suite finish log |

---

## Architecture

### BasePage

`src/pages/BasePage.ts` is the foundation class that all page objects extend. It contains common methods used across pages.

| Category       | Methods |
|----------------|---------|
| Navigation     | `goto()` |
| Actions        | `click()`, `fill()` |
| Assertions     | `expectToBeVisible()`, `expectToHaveText()` |
| Utilities      | `getNumberFromText()` |

---

### Page Objects

Each UI page has a dedicated class containing locators and page-specific actions.

| Page Object | Purpose |
|------------|---------|
| `LoginPage` | Opens SauceDemo, performs login, validates login errors |
| `ProductsPage` | Validates products page, reads product prices, adds two most expensive products |
| `CartPage` | Validates cart item count and proceeds to checkout |
| `CheckoutPage` | Fills checkout form, validates item total, finishes order |

---

### Fixtures

`tests/fixtures/pages.fixture.ts` implements custom Playwright fixtures to automatically instantiate and inject Page Objects into tests.

Example usage:

```ts
test('Valid Login', async ({ loginPage, productsPage }) => {
  await loginPage.open(uiData.baseUrl);
  await loginPage.login('standard_user', 'secret_sauce');
  await productsPage.expectLoaded();
});
```

This keeps tests clean and avoids manual page object initialization in every test.

---

### API Layer

`src/api/simpleBooksApi.ts` contains reusable API methods using Playwright's native `request` context.

| Method | Purpose |
|--------|---------|
| `init()` | Creates API request context |
| `generateToken()` | Sends `POST /api-clients/` and returns bearer token |
| `createOrder()` | Sends `POST /orders` and returns created order details |
| `getOrder()` | Sends `GET /orders/:orderId` |
| `dispose()` | Disposes API request context |

---

### Utilities

| File | Purpose |
|------|---------|
| `random.util.ts` | Generates random strings, emails, and numbers for dynamic test data |

---

## Test Scenarios

### UI Test Scenarios

| TC ID | Module | Test Name | Automated Verifications |
|------|--------|-----------|--------------------------|
| `TC_UI_001` | Login | Valid Login | Navigates to SauceDemo, logs in with valid credentials, verifies Products page |
| `TC_UI_002` | Login | Data-Driven Invalid Login Validation | Verifies validation errors for missing username, missing password, and invalid credentials using JSON data |
| `TC_UI_003` | Checkout | End-to-End Checkout Flow | Logs in, dynamically adds two most expensive products, checks out, verifies item total, and validates order completion messages |

### API Test Scenarios

| TC ID | Module | Test Name | Automated Verifications |
|------|--------|-----------|--------------------------|
| `TC_API_001` | Auth & Orders | `[POST] Create New Book Order` | Generates bearer token, creates order, validates `201 Created`, and verifies returned `orderId` |
| `TC_API_002` | Orders | `[GET] Fetch Created Order` | Fetches created order, validates `200 OK`, and verifies `bookId` and `customerName` |

---

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run UI Tests Only

```bash
npx playwright test tests/ui
```

or:

```bash
npm run test:ui
```

### Run API Tests Only

```bash
npx playwright test tests/api
```

or:

```bash
npm run test:api
```

### Run Both UI & API Tests

```bash
npx playwright test tests/ui tests/api
```

### Run Tests in Headed Mode

```bash
npx playwright test --headed
```

or:

```bash
npm run test:headed
```

### Run Specific Browser Project

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Run Specific Test File

```bash
npx playwright test tests/ui/login.spec.ts
```

### Debug Tests

```bash
npx playwright test --debug
```

---

## Reporting

### HTML Report

Playwright HTML report is generated automatically after test execution.

View the report locally:

```bash
npx playwright show-report
```

Default output folder:

```bash
playwright-report/
```

### JSON Report

A JSON report is generated at:

```bash
reports/playwright-report.json
```

---

## GitHub Actions

The repository includes a GitHub Actions workflow at:

```bash
.github/workflows/playwright.yml
```

The workflow:

- Runs automatically on push to `main`
- Runs daily at `03:00 AM Jordan Time`
- Installs dependencies
- Installs Playwright browsers
- Runs the full test suite headlessly
- Uploads the Playwright HTML report as an artifact

---

## Submission Checklist

- Public GitHub repository URL is ready to share
- All 5 required test cases are automated
- README contains all mandatory sections
- `.gitignore` is configured
- GitHub Actions YAML file is included
- Custom Playwright fixtures are implemented
- Framework can run with one command:

```bash
npx playwright test
```
