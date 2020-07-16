#!/usr/bin/env node
'use strict';
const fs = require('fs');
const meow = require('meow');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const build = require('./build');

const cli = meow(`
	Usage
	  $ create-tailwind-rn <input> <output>
`);

postcss([tailwind])
	.process(fs.readFileSync(cli.input[0]), {from: undefined})
	.then(({css}) => {
		const styles = build(css);
		fs.writeFileSync(cli.input[1], JSON.stringify(styles, null, '\t'));
	})
	.catch(error => {
		console.error('> Error occurred while generating styles');
		console.error(error.stack);
		process.exit(1);
	});
