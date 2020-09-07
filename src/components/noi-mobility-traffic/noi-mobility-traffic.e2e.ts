import { newE2EPage } from '@stencil/core/testing';

describe('noi-mobility-traffic', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<noi-mobility-traffic></noi-mobility-traffic>');
    const element = await page.find('noi-mobility-traffic');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<noi-mobility-traffic></noi-mobility-traffic>');
    const component = await page.find('noi-mobility-traffic');
    const element = await page.find('noi-mobility-traffic >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
