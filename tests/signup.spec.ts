import { test, expect } from '@playwright/test';

const url = 'https://lastpass.com/create_account.php';
const generalError = 'Something doesn\'t look right. Please check that you\'ve entered everything correctly.';

test.beforeEach(async ({ page }, testInfo) => {
    page.goto(url);
    console.log(`Running ${testInfo.title}`);
});

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus)
        console.log(`Did not run as expected, ended up at ${page.url()}`);
});

// Helper function to generate a unique email
function generateUniqueEmail() {
    const timestamp = Date.now(); 
    return `test+${timestamp}@example.com`; 
}


test.describe('LastPass signup', () => {

    test.skip('signup successful', async ({ page }) => {
        await page.fill('input#email', generateUniqueEmail());
        await page.fill('input#masterpassword', 'DGHiMm9frZ!DUes');
        await page.fill('input#confirmmpw', 'DGHiMm9frZ!DUes');
        await page.click('button#createaccountbtn');

        await expect(page).toHaveURL(/.*create-account\/success/);
        await expect(page.locator('h1')).toHaveText('Welcome to LastPass');
    })

    test('signup failed, invalid email', async ({ page }) => {
        await page.fill('input#email', 'your-emailexample.com');
        await page.fill('input#masterpassword', 'gdhsjv%njjknk*QQQ!115');
        await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
        await page.fill('input#confirmmpw', 'gdhsjv%njjknk*QQQ!115');
        await page.click('button#createaccountbtn');
        await expect(page.getByText(generalError)).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();
    })

    test('signup failed, empty email', async ({ page }) => {
        await page.fill('input#email', '');
        await page.fill('input#masterpassword', 'gdhsjv%njjknk*QQQ!115');
        await page.fill('input#confirmmpw', 'gdhsjv%njjknk*QQQ!115');
        await page.click('button#createaccountbtn');

        await expect(page.getByText(generalError)).toBeVisible();
        await expect(page.getByText('Please enter your email address.')).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();

    })

    test('signup failed, weak password with less than 12 char', async ({ page }) => {
        await page.fill('input#email', 'your-email@example.com');
        // less than 12 char
        await page.fill('input#masterpassword', 'gdHs12jv%nj');
        // Simulate a click
        await page.click('body');

        // Locate the characters element
        const charactersElement = await page.locator('li.pw-req__conditions--characters');

        const invalidCheck = await charactersElement.locator('span.pw-req__conditions--check.invalid');
        const requiredText = await charactersElement.locator('text="At least 12 characters long"');

        // Verify invalid check and error text vesibility
        await expect(invalidCheck).toBeVisible();
        await expect(requiredText).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();

    })

    test('signup failed, weak password with less 1 number', async ({ page }) => {
        await page.fill('input#email', 'your-email@example.com');
        // less than 1 numberr
        await page.fill('input#masterpassword', 'gdHsrtjv%njw');
        // Simulate a click
        await page.click('body');

        // Locate the num element
        const numElement = await page.locator('li.pw-req__conditions--num');

        const invalidCheck = await numElement.locator('span.pw-req__conditions--check.invalid');
        const requiredText = await numElement.locator('text="At least 1 number"');

        // Verify element visibility and text content
        await expect(invalidCheck).toBeVisible();
        await expect(requiredText).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();

    })

    test('signup failed, weak password with less 1 lowercase', async ({ page }) => {
        await page.fill('input#email', 'your-email@example.com');
        // less than 1 lowercase
        await page.fill('input#masterpassword', 'BHKJCRTD%WW2');
        // Simulate a click
        await page.click('body');

        // Locate the num element
        const lowerCaseElement = await page.locator('li.pw-req__conditions--lower');

        const invalidCheck = await lowerCaseElement.locator('span.pw-req__conditions--check.invalid');
        const requiredText = await lowerCaseElement.locator('text="At least 1 lowercase letter"');

        // Verify element visibility and text content
        await expect(invalidCheck).toBeVisible();
        await expect(requiredText).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();

    })

    test('signup failed, weak password with less 1 uppercase', async ({ page }) => {
        await page.fill('input#email', 'your-email@example.com');
        // less than 1 uppercase
        await page.fill('input#masterpassword', 'ghjklycs%ww2');
        // Simulate a click
        await page.click('body');

        // Locate the uppercase element
        const upperCaseElement = await page.locator('li.pw-req__conditions--upper');

        const invalidCheck = await upperCaseElement.locator('span.pw-req__conditions--check.invalid');
        const requiredText = await upperCaseElement.locator('text="At least 1 uppercase letter"');

        // Verify element visibility and text content
        await expect(invalidCheck).toBeVisible();
        await expect(requiredText).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();

    })

    test('signup failed, weak password with less 1 spec character', async ({ page }) => {
        await page.fill('input#email', 'your-email@example.com');
        // less than 1 special char
        await page.fill('input#masterpassword', 'ghjklycsEww2');
        // Simulate a click
        await page.click('body');

        // Locate the special char element
        const spCharElement = await page.locator('li.pw-req__conditions--special');

        const invalidCheck = await spCharElement.locator('span.pw-req__conditions--check.invalid');
        const requiredText = await spCharElement.locator('text="At least 1 special character"');

        // Verify element visibility and text content
        await expect(invalidCheck).toBeVisible();
        await expect(requiredText).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();

    })

    test('signup failed, password equals email address', async ({ page }) => {
        await page.fill('input#email', 'your-email@example.com');
        // equals email address
        await page.fill('input#masterpassword', 'your-email@example.com');
        // Simulate a click
        await page.click('body');

        // Locate the special char element
        const emailMessageElement = await page.locator('li.pw-req__conditions--email');

        const invalidCheck = await emailMessageElement.locator('span.pw-req__conditions--check.invalid');
        const requiredText = await emailMessageElement.locator('text="Not your email"');

        // Verify element visibility and text content
        await expect(invalidCheck).toBeVisible();
        await expect(requiredText).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();

    })

    test('signup failed, passwords do not match', async ({ page }) => {
        await page.fill('input#email', 'your-email@example.com');
        // passwords do not match
        await page.fill('input#masterpassword', 'DGHiMm9frZ!DUes');
        await page.fill('input#confirmmpw', 'DGHiMm9frZ!DUe');
        // Simulate a click
        await page.click('body');

        await expect(page.getByText('Make sure this matches your master password.')).toBeVisible();

        await page.click('button#createaccountbtn');
        await expect(page.getByText('Something doesn\'t look right. Please check that you\'ve entered everything correctly.')).toBeVisible();
    })

})