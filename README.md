<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://fitforfutbol.com/wp-content/uploads/2016/04/athletetrack.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app : https://ai.studio/apps/drive/1_NBVdSFcNpKc_CfzY8k4AcTxMrZDNb8f

1. Data Collection Layer
This layer collects data, such as external wellness/load/rehab/testing forms, filled out by athletes & staff. Using the automation available in the WhatsApp Business API to set reminders and send form links to the user's WhatsApp. The processing through Google Forms writes directly into structured Google Sheets tabs which enables clean, human-readable staging data ready for ingestion to Big Query

2. Data Ingestion & Storage Layer
The primary focus here would be to have reliable ingestion and a schema-consistent centralized data source through Google Sheets, pipelined into BigQuery.  Apps Script converts rows to JSON and loads them into BigQuery tables. This creates a unified athlete dataset comprising the following datasets: Load, Wellness, Rehab, Censor-Based Data, and athlete details.

3. Backend API & Analytics Layer
Using fast queries, accurate metrics, stable APIs into the big query tables, the backend scrapes required data for the frontend visualisation. The connection to sheet enables it to be dynamic and update on form submission. The main processing unit in this part is the use of FastAPI on Cloud Run to build the backend.

4. AI Intelligence & Frontend Layer
Mian purpose is to deliver actionable insights, fast responses, intuitive UX to help coaches have a Team overview on many layers of data collected, drawing trends and makinf informed decision. The AI aims to act as an Assisstant Coach to be able to guide the coach based on the data ingested. The AI built is Vertex AI Gemini 2.5 - flash

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
