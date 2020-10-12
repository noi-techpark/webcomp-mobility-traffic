import { newSpecPage } from '@stencil/core/testing';
import { getComponentClosestLang } from './locale';

describe('locale', () => {
  it('gets proper self lang attribute', async () => {
    const { root } = await newSpecPage({
      components: [],
      html: '<div id="test" lang="it"></div>',
    });
    const lang = getComponentClosestLang(root)
    expect(lang).toEqual('it');
  });

  it('gets default "en" lang attribute when no attribute', async () => {
    const { root } = await newSpecPage({
      components: [],
      html: '<div id="test"></div>',
    });
    const lang = getComponentClosestLang(root)
    expect(lang).toEqual('en');
  });

  it('gets default "en" lang attribute when unsupported lang on element', async () => {
    const { root } = await newSpecPage({
      components: [],
      html: '<div id="test" lang="ru"></div>',
    });
    const lang = getComponentClosestLang(root)
    expect(lang).toEqual('en');
  });

  it('gets default "en" lang attribute when unsupported lang on html', async () => {
    const { root } = await newSpecPage({
      components: [],
      html: '<div id="test"></div>',
      language: "ru"
    });
    const lang = getComponentClosestLang(root)
    expect(lang).toEqual('en');
  });

  it('gets proper lang attribute of parent (html tag)', async () => {
    const { root } = await newSpecPage({
      components: [],
      html: '<div id="test"></div>',
      language: 'it'
    });
    const lang = getComponentClosestLang(root)
    expect(lang).toEqual('it');
  });

});
