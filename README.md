# icon_chromifier
Create outlined versions of images to use for further processing

## Why

My brother wanted to know if it's possible to generate icons for an icon pack similar to [Line Icons](https://play.google.com/store/apps/details?id=com.natewren.linesfree&hl=en_US) on Google Play.

Of course I said yes it's possible, but without A.I. you'd need a middle step in order to detect the outlines, so I set to work creating an algorithm that could do that. Suprisingly, what I came up with was simple, fast and works incredibly well.

## How

Essentially, iterate over each pixel in an array of pixels and average the differences between each channel. Subtract this value from a pixel of `n` units away from the current pixel in all four directions and average the resulting value. If the value exceeds a given threshold (11 seems to work almost everywhere), the difference is major and the resulting colour change is classed *dramatic*. In other words, a major line. These can simply be marked in white while the rest remains dark.

# Build

To build you'll need several things. Node.js, A browser that supports es6, TypeScript, Grunt and NPM (I use yarn).

1) Clone this repo and navigate into it.

```
git clone https://github.com/J-Cake/icon_chromifier.git && cd icon_chromifier
```

2) Install all dependencies.

```
$ yarn
```

or with NPM 

```
$ npm install
```

3) build the server

```
$ tsc
```

4) build the client

```
$ cd public
```

```
$ tsc
```

```
$ grunt <mode> # supported are "production" and "development"
```

production mode creates a minified file while development mode does not and enables a watching server.

5) run the server

```
$ node ./dist/server.js
```

6) Open in browser (http://localhost:1920)
