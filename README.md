# @augu/sysinfo
[![npm version](https://badge.fury.io/js/%40augu%2Fsysinfo.svg)](https://badge.fury.io/js/%40auguwu%2Fsysinfo) [![Discord](https://discordapp.com/api/guilds/382725233695522816/embed.png)](https://discord.gg/yDnbEDH) [![Travis](https://travis-ci.org/auguwu/sysinfo.svg?branch=master)](https://travis-ci.org/auguwu/sysinfo) [![Build status](https://ci.appveyor.com/api/projects/status/7v8r6tkqlc1xo1e6?svg=true)](https://ci.appveyor.com/project/ohlookitsAugust/sysinfo)

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

## LICENSE

> Released under the **MIT** License

```
Copyright (c) 2019-2020 August

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```