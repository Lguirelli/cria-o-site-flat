import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDocument,googleFontsHref,designTokensCSS} from '../lib/document.js';

const tokens={
 headingFont:'Playfair Display',bodyFont:'DM Sans',
 palette:{background:'#fafafa',surface:'#f0f0f0',text:'#202020',primary:'#6547d8',accent:'#249b7e'}
};

test('Google Fonts CSS2 URL includes selected heading and body families without an API key',()=>{
 const href=googleFontsHref(tokens);
 assert.match(href,/^https:\/\/fonts\.googleapis\.com\/css2\?/);
 assert.match(href,/family=Playfair\+Display/);
 assert.match(href,/family=DM\+Sans/);
 assert.match(href,/display=swap$/);
});

test('design tokens generate safe global color and typography variables',()=>{
 const css=designTokensCSS(tokens);
 assert.match(css,/--forma-color-primary:#6547d8/);
 assert.match(css,/--forma-font-heading:"Playfair Display"/);
 assert.match(css,/--forma-font-body:"DM Sans"/);
 const unsafe=designTokensCSS({...tokens,palette:{...tokens.palette,primary:'red;position:fixed'}});
 assert.match(unsafe,/--forma-color-primary:#6757d9/);
 assert.doesNotMatch(unsafe,/position:fixed/);
});

test('exported document loads Google Fonts and embeds the generated palette, never the editor API key',()=>{
 const project={name:'Teste',home:'p1',pages:[{id:'p1',slug:'index',name:'Home',blocks:[]}],links:[],styleTokens:tokens};
 const page={id:'p1',slug:'index',name:'Home',blocks:[]};
 const html=buildDocument(project,page,{blocks:[]});
 assert.match(html,/data-forma-google-fonts/);
 assert.match(html,/fonts\.googleapis\.com\/css2/);
 assert.match(html,/data-forma-design-tokens/);
 assert.match(html,/--forma-color-accent:#249b7e/);
 assert.doesNotMatch(html,/AIza/);
});
