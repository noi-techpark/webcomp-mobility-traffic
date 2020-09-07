import { newSpecPage } from '@stencil/core/testing';
import { NoiMobilityTraffic } from './noi-mobility-traffic';

describe('noi-mobility-traffic', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [NoiMobilityTraffic],
      html: '<noi-mobility-traffic></noi-mobility-traffic>',
    });
    expect(root).toEqualHtml(`
      <noi-mobility-traffic>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </noi-mobility-traffic>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [NoiMobilityTraffic],
      html: `<noi-mobility-traffic first="Stencil" last="'Don't call me a framework' JS"></noi-mobility-traffic>`,
    });
    expect(root).toEqualHtml(`
      <noi-mobility-traffic first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </noi-mobility-traffic>
    `);
  });
});
