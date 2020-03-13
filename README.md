# @augu/sysinfo
[![npm version](https://badge.fury.io/js/%40augu%2Fsysinfo.svg)](https://badge.fury.io/js/%40nowoel%2Fsysinfo) [![Discord](https://discordapp.com/api/guilds/382725233695522816/embed.png)](https://discord.gg/yDnbEDH) [![Travis](https://travis-ci.org/nowoel/sysinfo.svg?branch=master)](https://travis-ci.org/nowoel/sysinfo) [![Build status](https://ci.appveyor.com/api/projects/status/7v8r6tkqlc1xo1e6?svg=true)](https://ci.appveyor.com/project/ohlookitsAugust/sysinfo)

> **Shows extended information from Node's `os` module**
>
> Based (and updated version!) of [os-utils](https://github.com/oscmejia/os-utils)
>
> [Documentation](https://docs.augu.dev/sysinfo) **|** [NPM](https://npmjs.com/package/@augu/sysinfo) **|** [GitHub](https://github.com/auguwu/sysinfo)

## Usage
```js
const sys = require('@augu/sysinfo');
sys.getCPUInfo();
```

## Using in an IDE
[If you're using VSCode], you'll see a `@works` annotation label in JSDoc when hovered/looking in this repository, it lists the Operating Systems that will work with that function. It'll also show warnings in the JSDoc by listing the warnings to you or emits a warning in the console if not used properly

## Contributing
> Thanks for contributing! Here's how to

- Fork this repository!
- Clone it to your PC and create your branch (``git checkout -b branch``)
- Code your heart out!~
- Lint the package for any code errors (``npm run lint`` or ``yarn lint``)
- Run (or add) tests in the `tests/test.js` file and run it
- Push to your branch (``git push -u origin branch``)
- Submit a pull request

## Is this harmful?!
No it's not, most of the Unix and Windows only commands are executed from your computer itself. This library runs a command and returns an output from that command, so if you don't want that, then don't install this library.

## LICENSE
`sysinfo` is released under the **MIT** License, view [here](/LICENSE) for more information.