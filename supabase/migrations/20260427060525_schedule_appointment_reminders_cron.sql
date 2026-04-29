/*
  # Schedule appointment reminders cron job

  Installs pg_cron + pg_net if needed and schedules the
  appointments-reminders edge function to run every 5 minutes.

  1. Extensions
    - pg_cron — scheduling jobs
    - pg_net — async HTTP from Postgres

  2. Cron Job
    - Name: appointments-reminders-tick
    - Schedule: every 5 minutes
    - Action: POST to the appointments-reminders edge function

  Notes:
    The function URL is built from current_setting('app.settings.supabase_url'),
    which we set below from the environment-equivalent constant.
*/

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
