import { test, expect } from '@playwright/test';

const url = 'https://lastpass.com/create_account.php';
const generalError = 'Something doesn\'t look right. Please check that you\'ve entered everything correctly.';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(url);
    console.log(`Running ${testInfo.title}`);
});

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
});

// Helper function for unique email generation
function generateUniqueEmail() {
    const timestamp = Date.now();
    return `test+${timestamp}@example.com`;
}

// Helper function to fill signup fields
async function fillSignupFields(page, email, password, confirmPassword) {
    await page.fill('input#email', email);
    await page.fill('input#masterpassword', password);
    await page.fill('input#confirmmpw', confirmPassword);

    // Simulate a click
    await page.click('body');
}

// Helper to verify specific requirements based on class and text
async function verifyRequirement(page, className, errorText) {
    const element = await page.locator(className);
    const invalidCheck = await element.locator('span.pw-req__conditions--check.invalid');
    const requiredText = await element.locator(`text="${errorText}"`);

    await expect(invalidCheck).toBeVisible();
    await expect(requiredText).toBeVisible();
}

test.describe('LastPass signup', () => {

    test.skip('signup successful', async ({ page }) => {
        await fillSignupFields(page, generateUniqueEmail(), 'StrongPass123!', 'StrongPass123!');
        // Simulate a click
        await page.click('body');
        await expect(page).toHaveURL(/.*create-account\/success/);
        await expect(page.locator('h1')).toHaveText('Welcome to LastPass');
    });

    test('signup failed - various invalid email inputs and password mismatch', async ({ page }) => {
        const negativeCases = [
            {
                email: 'invalid-email',
                password: 'dq2r-qW!R:ETGrZ',
                confirmPassword: 'dq2r-qW!R:ETGrZ',
                errorText: 'Please enter a valid email address',
            },
            {
                email: '',
                password: 'dq2r-qW!R:ETGrZ',
                confirmPassword: 'dq2r-qW!R:ETGrZ',
            },
            {
                email: 'valid@email.com',
                password: 'dq2r-qW!R:ETGrZ',
                confirmPassword: 'dq2r-qW!R:ETGrZ!',
                errorText: 'Make sure this matches your master password.',
            },
           
        ];

        for (const { email, password, confirmPassword, errorText, } of negativeCases) {
            await fillSignupFields(page, email, password, confirmPassword);

            // Verify specific error message
            if (errorText) {
            await expect(page.getByText(errorText)).toBeVisible();
            }

            await page.click('button#createaccountbtn');

            // Verify general error message
            await expect(page.getByText(generalError)).toBeVisible();
        }
    });

    test('signup failed - various invalid password inputs', async ({ page }) => {
        const negativeCases = [
            {
                email: 'valid@email.com',
                password: 'short',
                confirmPassword: 'short',
                errorText: 'At least 12 characters long',
                requirementClass: 'li.pw-req__conditions--characters',
            },
            {
                email: 'valid@email.com',
                password: 'NoNumbersHere!',
                confirmPassword: 'NoNumbersHere!',
                errorText: 'At least 1 number',
                requirementClass: 'li.pw-req__conditions--num',
            },
            {
                email: 'valid@email.com',
                password: 'noupper12345!',
                confirmPassword: 'noupper123!',
                errorText: 'At least 1 uppercase letter',
                requirementClass: 'li.pw-req__conditions--upper',
            },
            {
                email: 'valid@email.com',
                password: 'NOLOWER12345!',
                confirmPassword: 'NOLOWER12345!',
                errorText: 'At least 1 lowercase letter',
                requirementClass: 'li.pw-req__conditions--lower',
            },
            {
                email: 'valid@email.com',
                password: 'NoSpecial12345',
                confirmPassword: 'NoSpecial12345',
                errorText: 'At least 1 special character',
                requirementClass: 'li.pw-req__conditions--special',
            },
            {
                email: 'valid@email.com',
                password: 'valid@email.com',
                confirmPassword: 'valid@email.com',
                errorText: 'Not your email',
                requirementClass: 'li.pw-req__conditions--email',
            },
        ];

        for (const { email, password, confirmPassword, errorText, requirementClass } of negativeCases) {
            await fillSignupFields(page, email, password, confirmPassword);

            // Verify specific error message
            await expect(page.getByText(errorText)).toBeVisible();

            // If there’s an additional requirement class to check, verify invalid state
            if (requirementClass) {
                await verifyRequirement(page, requirementClass, errorText);
            }

            await page.click('button#createaccountbtn');

            // Verify general error message
            await expect(page.getByText(generalError)).toBeVisible();
        }
    });
});
