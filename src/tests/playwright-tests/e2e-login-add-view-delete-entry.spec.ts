import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

test('user can sign in, add a entry, view the entry and delete the entry', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Sharc - Shared Calendars Simplified/);

  // Sign in with test user
  await page.getByRole('button', { name: 'Sign in with Email' }).click();
  await page.getByLabel('Email').fill('testuser@testuser.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  //wait for the calendar to load
  await page.waitForURL(/get-calendar/);

  // navigate to add calendar entry page
  await page.getByRole('link', { name: 'Add Entry' }).click();
  await page.waitForURL(/add-entry/);

  // Fill in the entry form
  const entryTitle = `Test Entry${Date.now()}`;
  await page.getByLabel('Title').fill(entryTitle);
  await page.getByLabel('Description').fill('This is a test entry.');
  // Select today's date
  await page.getByLabel('date').click();
  const today = new Date().getDate().toString();
  await page.getByRole('gridcell', { name: today, exact: true }).click();
  // fill in time fields
  await page.getByPlaceholder('Start Hour').fill('10');
  await page.getByLabel('Start time in minutes').fill('01');
  await page.getByPlaceholder('End Hour').fill('10');
  await page.getByLabel('End time in minutes').fill('29');
  //submit the form
  await page.getByRole('button', { name: 'Submit' }).click();

  //wait for the calendar to load
  await page.waitForURL(/get-calendar/);

  // Verify the entry was added
  const entryTitleElement = page.getByText(entryTitle);
  await expect(entryTitleElement).toBeVisible();

  // open the entry
  await page.getByRole('button', { name: entryTitle }).click();
  await page.waitForURL(/view-entry/);

  //check the entry details
  await expect(page.getByText('This is a test entry.')).toBeVisible();
  const entryDate = format(new Date(), 'dd-MM-yyyy');
  await expect(page.getByText(entryDate)).toBeVisible();
  await expect(page.getByText('10:01-10:29')).toBeVisible();

  // delete the entry
  await page.getByRole('button', { name: 'Delete Entry' }).click();
  const removedEntryTitleElement = page.getByText(entryTitle);
  await expect(removedEntryTitleElement).not.toBeVisible();
});
