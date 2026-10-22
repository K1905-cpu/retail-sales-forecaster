# Retail Sales and Inventory Forecaster 📈🛒

An interactive, responsive web application for Machine Learning-powered retail sales forecasting and automated inventory management decision-making.

> **Course**: 342IT Data Analytics & Data Science  
> **Student**: Kalp Shah (ID: 24IT447)  
> **Faculty Guide**: Prof. Disha D Panchal  
> **Institution**: Birla Vishvakarma Mahavidyalaya  

---

## 🌟 Key Features

- **Interactive Predictive Simulation**: Real-time sales estimation based on demand projection, current inventory, replenishment orders, pricing, and promotional discount strategies.
- **Multi-Model Benchmark Comparison**:
  - **Random Forest Regressor** ($R^2 = 0.994$, $\text{RMSE} = 8.539$, $\text{MAE} = 7.249$)
  - **Linear Regression** ($R^2 = 0.994$, $\text{RMSE} = 8.605$, $\text{MAE} = 7.422$)
  - **Decision Tree Regressor** ($R^2 = 0.988$, $\text{RMSE} = 11.780$, $\text{MAE} = 9.471$)
- **Automated Inventory Health Intelligence**:
  - Optimal Stock Buffer alerts
  - Overstock warning with carrying cost calculation
  - Understock / Out-of-Stock warnings with recommended reorder amounts
- **Key Business Metrics**:
  - Projected Daily Revenue
  - Post-Sales Remaining Stock
  - Stock Turnover Rate (%)
  - Dynamic Recommended Reorder Quantity
- **Preset Scenarios**: One-click configuration for *Average Day*, *Promotion Day*, *Low Stock Situation*, and *Reset Defaults*.
- **Integrated Slide Deck & Project Artifacts**: Embedded research presentation slides and downloadable academic project reports.

---

## 📂 Project Structure

```
website/
├── index.html        # Main web interface
├── styles.css        # Responsive modern stylesheet
├── app.js            # Core prediction logic & UI state handling
├── vercel.json       # Vercel deployment configuration
├── .gitignore        # Git ignore rules
├── README.md         # Project documentation
├── assets/           # Project PDF, PPTX, and visual assets
└── slides/           # High-resolution presentation slides
```

---

## 💻 Local Development

Since this is a lightweight static web app, no build step or package manager is required.

### Option 1: Double-click
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Brave).

### Option 2: Local HTTP Server (Python)
In your terminal, navigate to this folder and run:
```bash
python -m http.server 8000
```
Then visit [http://localhost:8000](http://localhost:8000).

### Option 3: VS Code Live Server
Right-click `index.html` inside VS Code and choose **"Open with Live Server"**.

---

## 🚀 Pushing to GitHub

To push only this website project to a dedicated GitHub repository:

1. **Open Terminal in the `website` directory**:
   ```bash
   cd "website"
   ```

2. **Initialize Git**:
   ```bash
   git init
   git branch -M main
   ```

3. **Stage and commit files**:
   ```bash
   git add .
   git commit -m "Initial commit: Retail Sales & Inventory Forecaster Web App"
   ```

4. **Link to your GitHub repository and push**:
   - Create a new public or private repository on [GitHub](https://github.com/new).
   - Run the following commands (replace `<YOUR-GITHUB-USERNAME>` and `<REPO-NAME>` with yours):
   ```bash
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<REPO-NAME>.git
   git push -u origin main
   ```

---

## ☁️ Deploying to Vercel

### Method 1: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository (`<REPO-NAME>`).
4. If your repository contains only this website folder, keep the **Root Directory** as `./`. If your repository contains the parent folder, set **Root Directory** to `website`.
5. Framework Preset: Leave as **Other** (Vercel automatically detects static HTML/CSS/JS).
6. Click **Deploy**. Your site will be live instantly with a free `.vercel.app` URL!

### Method 2: Via Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the interactive prompts to deploy. For production deployment:
```bash
vercel --prod
```
