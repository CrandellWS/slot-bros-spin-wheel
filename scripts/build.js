#!/usr/bin/env node
import esbuild from 'esbuild';
import {readFile} from 'fs/promises';
import * as util from './util.js';
import * as browsersync from 'browser-sync';

function startWebServer (startPath) {

  browsersync.create();

  browsersync.init({
    server: '.',
    startPath: startPath,
    watch: true,
    notify: false,
    ignore: [
      './bin/*.*',
      './src/*.*', // esbuild is monitoring this folder.
      ],
  });

}

const p = JSON.parse(
  await readFile(
    new URL('../package.json', import.meta.url)
  )
);

const entryPoint = process.argv.filter(i => i.startsWith('-entryPoint='))[0]?.substring(12);
const servePath = process.argv.filter(i => i.startsWith('-servePath='))[0]?.substring(11);
const format = process.argv.filter(i => i.startsWith('-format='))[0]?.substring(8);
const formatPreamble = format ? ' (' + format.toUpperCase() + ') ': ' ';
const fileName = process.argv.filter(i => i.startsWith('-fileName='))[0]?.substring(10);
const defaultFileName = p.name + '.js';
const servePathNpm = process.env.npm_config_servepath;
const shouldStartWebServer = !!servePathNpm || !!servePath;
const preamble = [
  `/**\n`,
  ` * ${p.name}${formatPreamble}v${p.version}\n`,
  ` * ${p.homepage}\n`,
  ` * Copyright (c) ${p.author} ${util.dateFormat (new Date (), '%Y')}.\n`,
  ` * Distributed under the ${p.license} license.\n`,
  ` */`,
];

try {
  await esbuild.build({
    entryPoints: [entryPoint],
    outfile: `dist/${fileName ?? defaultFileName}`,
    bundle: true,
    minify: true,
    target: ['es6'],
    format: format,
    watch: shouldStartWebServer,
    banner: {'js': preamble.join('')},
    sourcemap: true,
  })
} catch (error) {
  console.error(error);
  process.exit(1);
}

if (shouldStartWebServer) startWebServer(servePathNpm || servePath);