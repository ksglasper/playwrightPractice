const { test, expect } = require("@playwright/test");

// run tests in headful mode so you can see the browser
test.use({ headless: false, slowMo: 1000 });

// test("my first test", async ({ page }) => {
//   // go to Netflix.com
//   await page.goto("https://www.netflix.com");

//   // assert page title appears
//   await expect(page.locator('[data-uia="nmhp-card-hero-text-title"]')).toHaveText(
//     "Unlimited movies, TV shows, and more"
//   );
// });

test("navigate to sign in", async ({ page }) => {
  // go to Netflix.com
  await page.goto("https://www.netflix.com");

  //make sure landing page has accessible sign in
  await expect(page.locator('[data-uia="header-login-link"]')).toBeVisible();
  // navigate to sign in
  await page.locator('[data-uia="header-login-link"]').click()

  //confirm URL is the proper
  await expect(page).toHaveURL('https://www.netflix.com/login')
   
  //Establish and enter incorrect user and password
  const testEmail = 'mynameisJeff@gmail.com'
  const testPass = 'LifeisLikeABoxofChocol@tes22'

  await page.type('[data-uia="login-field"]', testEmail, {delay: 100})
  await page.type('[data-uia="password-field"]', testPass, {delay: 100})

  //Confirm form inputs correctly take in typed text
  const emailCheck = {value: await page.locator('[data-uia="login-field"]').inputValue()}
  const passCheck = {value: await page.locator('[data-uia="password-field"]').inputValue()}
  
  expect(emailCheck.value).toBe(testEmail)
  expect(passCheck.value).toBe(testPass)


  await page.keyboard.press('Enter')

  //assertion that checks against the 2 different error messages that can be generated
  const loginErrorMessage = await page.locator('[data-uia="text"]').innerHTML()

  const loginCheck = loginErrorMessage.includes(`Sorry, we can't find an account with this email address. Please try again or `) || loginErrorMessage.includes('Incorrect password.')

  
  expect(loginCheck).toBeTruthy()
    

  
  //clear email field
  await page.fill('[data-uia="login-field"]', '')

  //submit with an empty email
  await page.type('[data-uia="password-field"]', 'mynameisJeff@gmail.com', {delay: 100})
  await page.keyboard.press('Enter')
  expect( await page.locator('[data-uia="login-field+error"]').innerHTML()).toBe('Please enter a valid email or phone number.')

  //clear password field
  await page.fill('[data-uia="password-field"]', '')

  //submit with an empty password
  await page.type('[data-uia="login-field"]', 'mynameisJeff@gmail.com', {delay: 100})
  await page.keyboard.press('Enter')
  expect(await page.locator('[data-uia="password-field+error"]').innerHTML()).toBe('Your password must contain between 4 and 60 characters.')

  await page.waitForTimeout(500)

});

